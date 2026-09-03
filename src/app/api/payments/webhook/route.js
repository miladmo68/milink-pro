import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Server payment configuration is incomplete.");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });

  let event;
  try {
    const payload = await request.text();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("Stripe webhook signature error:", error.message);
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    console.log("[stripe-webhook] ignored event", { eventId: event.id, type: event.type });
    return NextResponse.json({ received: true });
  }

  try {
    const session = event.data.object;
    const briefId = session.metadata?.project_brief_id || session.client_reference_id;
    const amount = Number(session.amount_total);
    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null;
    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id || null;

    console.log("[stripe-webhook] checkout.session.completed received", {
      eventId: event.id,
      checkoutSessionId: session.id,
      briefId,
      amountPaidCents: amount,
      paymentStatus: session.payment_status,
      paymentIntentId,
      customerId,
    });

    if (!/^[0-9a-f-]{36}$/i.test(briefId || "") || !Number.isInteger(amount) || amount < 0 || session.payment_status !== "paid") {
      console.error("[stripe-webhook] checkout event rejected due to invalid project or payment data", {
        eventId: event.id,
        briefId,
        amountPaidCents: amount,
        paymentStatus: session.payment_status,
      });
      return NextResponse.json({ received: true });
    }

    const service = getServiceClient();
    const { data: matchingBrief, error: matchingBriefError } = await service
      .from("project_briefs")
      .select("id, client_id, business_name, payment_status, payment_method, amount_paid_cents, stripe_payment_intent_id, stripe_customer_id")
      .eq("id", briefId)
      .maybeSingle();

    if (matchingBriefError || !matchingBrief) {
      console.error("[stripe-webhook] matching brief lookup failed", {
        eventId: event.id,
        briefId,
        error: matchingBriefError?.message || "Brief not found",
      });
      return NextResponse.json({ received: true });
    }

    console.log("[stripe-webhook] matching brief found", {
      eventId: event.id,
      briefId: matchingBrief.id,
      clientId: matchingBrief.client_id,
      businessName: matchingBrief.business_name,
      priorPaymentStatus: matchingBrief.payment_status,
      priorPaymentMethod: matchingBrief.payment_method,
    });

    const { data: processed, error } = await service.rpc("record_stripe_checkout_payment", {
      p_stripe_event_id: event.id,
      p_checkout_session_id: session.id,
      p_payment_intent_id: paymentIntentId,
      p_project_brief_id: briefId,
      p_amount_paid_cents: amount,
      p_stripe_customer_id: customerId,
    });
    if (error) {
      console.error("[stripe-webhook] record_stripe_checkout_payment failed", {
        eventId: event.id,
        briefId,
        error: error.message,
        code: error.code,
      });
      throw error;
    }

    console.log("[stripe-webhook] record_stripe_checkout_payment completed", {
      eventId: event.id,
      briefId,
      processed: Boolean(processed),
    });

    if (processed || matchingBrief.payment_status === "paid") {
      const { data: admins, error: adminsError } = await service
        .from("profiles")
        .select("id")
        .in("role", ["admin", "super_admin"]);
      if (adminsError) {
        console.error("[stripe-webhook] could not load admin recipients for payment notification", { eventId: event.id, error: adminsError.message });
      } else if (admins?.length) {
        const formattedAmount = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount / 100);
        const message = `${matchingBrief.business_name || "A client project"} paid ${formattedAmount} through Stripe Checkout.`;
        const notificationCandidates = await Promise.all(admins.map(async (admin) => {
          const { data: existing, error: existingError } = await service
            .from("notifications")
            .select("id")
            .eq("recipient_id", admin.id)
            .eq("sender_id", matchingBrief.client_id)
            .eq("type", "payment")
            .eq("link", `/admin?tab=payments&project=${briefId}`)
            .eq("message", message)
            .limit(1);
          if (existingError) console.error("[stripe-webhook] could not check existing payment notification", { eventId: event.id, error: existingError.message });
          return existing?.length ? null : {
          user_id: admin.id,
          recipient_id: admin.id,
          sender_id: matchingBrief.client_id,
          title: "Stripe payment received",
          message,
          link: `/admin?tab=payments&project=${briefId}`,
          type: "payment",
          is_read: false,
          };
        }));
        const toInsert=notificationCandidates.filter(Boolean);
        if(toInsert.length){const { error: notificationError } = await service.from("notifications").insert(toInsert);if (notificationError) console.error("[stripe-webhook] admin payment notification insert failed", { eventId: event.id, error: notificationError.message });else console.log("[stripe-webhook] admin payment notifications created", { eventId: event.id, recipients: toInsert.length });}
        else console.log("[stripe-webhook] admin payment notification already exists", { eventId: event.id });
      } else {
        console.error("[stripe-webhook] no admin recipients were found for payment notification", { eventId: event.id });
      }
    }

    return NextResponse.json({ received: true, processed: Boolean(processed) });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
