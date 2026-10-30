import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminAccount } from "../../../../config/admins.js";
import { paymentSchedule } from "../../../../lib/paymentPlan.js";

export const runtime = "nodejs";

const UUID = /^[0-9a-f-]{36}$/i;

function json(error, status, extra = {}) {
  return NextResponse.json({ error, ...extra }, { status });
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

const isAdmin = (service, user) => isAdminAccount(service, user);

async function notify(service, rows) {
  if (!rows.length) return;
  const { error } = await service.from("notifications").insert(rows);
  if (error) console.error("e-Transfer notification insert failed", { message: error.message, code: error.code });
}

export async function POST(request) {
  try {
    const auth = await getRequestUser(request);
    if (auth.error) return json(auth.error, 401);

    const body = await request.json().catch(() => null);
    const briefId = typeof body?.briefId === "string" ? body.briefId : "";
    const action = typeof body?.action === "string" ? body.action : "";
    if (!UUID.test(briefId) || !["submit", "confirm", "reject"].includes(action)) {
      return json("A valid e-Transfer payment action is required.", 400);
    }

    const service = getServiceClient();
    const { data: brief, error: briefError } = await service
      .from("project_briefs")
      .select("*")
      .eq("id", briefId)
      .maybeSingle();
    if (briefError || !brief) return json("Project payment details were not found.", 404);

    const admin = await isAdmin(service, auth.user);
    const schedule = paymentSchedule(brief);
    const amount = schedule.dueNow;
    const projectName = brief.business_name || "Your website project";

    if (action === "submit") {
      if (admin || brief.client_id !== auth.user.id) return json("You do not have access to submit this payment notice.", 403);
      if (schedule.complete || ["paid", "approved"].includes(brief.payment_status)) return json("This project payment has already been completed.", 409);
      if (!Number.isInteger(amount) || amount <= 0) return json("Nothing is due right now.", 422);
      if (brief.payment_status === "e_transfer_submitted") return NextResponse.json({ status: "e_transfer_submitted", alreadySubmitted: true });

      const { data: updated, error } = await service
        .from("project_briefs")
        .update({ payment_status: "e_transfer_submitted", payment_method: "e_transfer", e_transfer_submitted_at: new Date().toISOString() })
        .eq("id", brief.id)
        .eq("client_id", auth.user.id)
        .in("payment_status", ["not_requested", "pending_review", "rejected", "checkout_pending", "partially_paid"])
        .select("id, e_transfer_submitted_at")
        .maybeSingle();
      if (error) {
        console.error("e-Transfer submit update failed", { briefId, message: error.message, code: error.code });
        return json("We could not record your e-Transfer notice. Please try again.", 500);
      }
      if (!updated) return json("This payment is already being reviewed. Refresh the page to see its current state.", 409);

      const { data: admins, error: adminsError } = await service.from("profiles").select("id").in("role", ["admin", "super_admin"]);
      if (adminsError) console.error("e-Transfer admin recipients lookup failed", { briefId, message: adminsError.message });
      await notify(service, (admins || []).map((recipient) => ({
        user_id: recipient.id,
        recipient_id: recipient.id,
        sender_id: brief.client_id,
        title: "e-Transfer marked as sent",
        message: `${projectName} marked an e-Transfer as sent — verify and confirm in Payments.`,
        link: `/admin?tab=payments&project=${brief.id}`,
        type: "payment",
        is_read: false,
      })));
      return NextResponse.json({ status: "e_transfer_submitted", submittedAt: updated.e_transfer_submitted_at });
    }

    if (!admin) return json("Only MiLink administrators can verify manual payments.", 403);
    if (!["e_transfer_submitted", "pending_review"].includes(brief.payment_status)) {
      return json("This e-Transfer is not awaiting manual review.", 409);
    }

    const confirming = action === "confirm";
    if (confirming && (!Number.isInteger(amount) || amount <= 0)) {
      return json("Nothing is due on this project right now, so there is no transfer to confirm.", 422);
    }
    // The transfer covers what was due (all of it, the deposit or the balance) and adds to what was already paid.
    const paidAfter = schedule.paid + amount;
    const fullyPaid = paidAfter >= schedule.total;
    const { data: updated, error } = await service
      .from("project_briefs")
      .update(confirming ? {
        payment_status: fullyPaid ? "paid" : "partially_paid",
        payment_method: "e_transfer",
        amount_paid_cents: paidAfter,
        e_transfer_confirmed_at: new Date().toISOString(),
      } : {
        payment_status: "rejected",
        payment_method: "e_transfer",
        e_transfer_confirmed_at: null,
      })
      .eq("id", brief.id)
      .in("payment_status", ["e_transfer_submitted", "pending_review"])
      .select("id, payment_status, amount_paid_cents, e_transfer_confirmed_at")
      .maybeSingle();
    if (error) {
      console.error("e-Transfer review update failed", { briefId, action, message: error.message, code: error.code });
      return json("We could not update this e-Transfer review. Please try again.", 500);
    }
    if (!updated) return json("This e-Transfer has already been reviewed. Refresh Payments for its current state.", 409);

    await notify(service, [{
      user_id: brief.client_id,
      recipient_id: brief.client_id,
      sender_id: auth.user.id,
      title: confirming ? "e-Transfer payment confirmed" : "e-Transfer payment needs attention",
      message: confirming
        ? (fullyPaid ? "Your payment has been confirmed. Thank you, the project is fully paid." : "Your deposit has been confirmed. Thank you, the balance is due when your site is ready for review.")
        : `We could not confirm the e-Transfer for ${projectName}. Please resend it or contact MiLink support.`,
      link: `/portal?tab=payments&project=${brief.id}`,
      type: "payment",
      is_read: false,
    }]);
    return NextResponse.json({ status: updated.payment_status, confirmedAt: updated.e_transfer_confirmed_at || null });
  } catch (error) {
    console.error("e-Transfer payment route failed", error);
    return json("We could not process this e-Transfer action. Please try again.", 500);
  }
}
