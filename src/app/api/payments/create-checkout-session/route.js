import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { isAdminAccount } from "../../../../config/admins.js";
import { paymentSchedule, priceForMethod } from "../../../../lib/paymentPlan.js";

export const runtime = "nodejs";


function json(message, status) {
  return NextResponse.json({ error: message }, { status });
}

function getOrigin(request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  return host ? `${proto}://${host}` : new URL(request.url).origin;
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Server payment configuration is incomplete.");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function getRequestUser(request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { error: "Please sign in to continue." };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return { error: "Authentication is not configured." };
  const authClient = createClient(url, anon, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await authClient.auth.getUser(token);
  return error || !data.user ? { error: "Your session has expired. Please sign in again." } : { user: data.user };
}

export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY) return json("Stripe Checkout is not configured yet.", 503);

  try {
    const auth = await getRequestUser(request);
    if (auth.error) return json(auth.error, 401);

    const body = await request.json().catch(() => null);
    const briefId = typeof body?.briefId === "string" ? body.briefId : "";
    if (!/^[0-9a-f-]{36}$/i.test(briefId)) return json("A valid project is required.", 400);

    const service = getServiceClient();
    const { data: brief, error: briefError } = await service
      .from("project_briefs")
      .select("*")
      .eq("id", briefId)
      .maybeSingle();

    if (briefError || !brief) return json("Project payment details were not found.", 404);

    const isAdmin = await isAdminAccount(service, auth.user);
    if (brief.client_id !== auth.user.id && !isAdmin) return json("You do not have access to this project payment.", 403);

    const schedule = paymentSchedule(brief);
    if (!schedule.total) return json("MiLink has not set a payable project amount yet.", 422);
    if (schedule.complete || ["paid", "approved"].includes(brief.payment_status)) return json("This project payment has already been completed.", 409);
    // Charge only what is due now under the project's payment plan (all of it, a deposit, or the balance).
    const amount = schedule.dueNow;
    if (!Number.isInteger(amount) || amount <= 0) return json("Nothing is due right now. The next payment opens when your site is ready for review.", 422);
    const price = priceForMethod(amount, "card");
    const partLabel = schedule.plan === "split" ? (schedule.paid > 0 ? "balance" : "deposit") : "project payment";

    const { data: reservation, error: reservationError } = await service.rpc("prepare_stripe_checkout", {
      p_project_brief_id: brief.id,
      p_force_new: false,
    });
    if (reservationError || !reservation?.[0]) return json("We could not prepare secure checkout. Please try again.", 500);

    let checkoutAttempt = reservation[0];
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    if (checkoutAttempt.checkout_session_id) {
      const existingSession = await stripe.checkout.sessions.retrieve(checkoutAttempt.checkout_session_id);
      if (existingSession.status === "open" && existingSession.payment_status === "unpaid" && existingSession.url) {
        return NextResponse.json({ url: existingSession.url });
      }
      const { data: renewedReservation, error: renewalError } = await service.rpc("prepare_stripe_checkout", {
        p_project_brief_id: brief.id,
        p_force_new: true,
      });
      if (renewalError || !renewedReservation?.[0]) return json("We could not renew secure checkout. Please try again.", 500);
      checkoutAttempt = renewedReservation[0];
    }

    const { data: clientProfile } = await service
      .from("profiles")
      .select("email, full_name")
      .eq("id", brief.client_id)
      .maybeSingle();
    let customerId = brief.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: clientProfile?.email || auth.user.email,
        name: clientProfile?.full_name || undefined,
        metadata: { project_brief_id: brief.id, client_id: brief.client_id },
      }, { idempotencyKey: `milink-customer-${brief.id}` });
      customerId = customer.id;
      await service.from("project_briefs").update({ stripe_customer_id: customerId }).eq("id", brief.id);
    }

    const origin = getOrigin(request);
    const projectName = brief.business_name || "MiLink website project";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      client_reference_id: brief.id,
      metadata: { project_brief_id: brief.id, client_id: brief.client_id, base_cents: String(amount) },
      success_url: `${origin}/portal?tab=payments&payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/portal?tab=payments&payment=cancelled`,
      line_items: [{
        price_data: {
          currency: "cad",
          product_data: { name: `${projectName} — ${partLabel}` },
          unit_amount: price.subtotal,
        },
        quantity: 1,
      }, ...(price.tax > 0 ? [{
        price_data: {
          currency: "cad",
          product_data: { name: price.taxLabel },
          unit_amount: price.tax,
        },
        quantity: 1,
      }] : [])],
    }, { idempotencyKey: `milink-checkout-${brief.id}-${checkoutAttempt.checkout_attempt_key}` });

    const { error: updateError } = await service
      .from("project_briefs")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", brief.id)
      .eq("stripe_checkout_attempt_key", checkoutAttempt.checkout_attempt_key);
    if (updateError) return json("Checkout was created but payment status could not be prepared. Please contact MiLink.", 500);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout session error:", error);
    // Name the kind of setup problem (never the key itself) so MiLink can fix it from the error text.
    if (error?.type === "StripeAuthenticationError") return json("Card payments are not set up correctly yet (the Stripe secret key is not valid). Please use e-Transfer for now.", 503);
    if (error?.type === "StripePermissionError") return json("Card payments are not set up correctly yet (the Stripe key is missing a permission). Please use e-Transfer for now.", 503);
    if (error?.type === "StripeInvalidRequestError") return json(`Stripe could not start checkout: ${String(error.message || "").slice(0, 160)}`, 500);
    return json("We could not start secure checkout. Please try again or use e-Transfer.", 500);
  }
}
