import { BUSINESS } from "../config/business.js";

// How a project is paid, chosen by the admin when sending the proposal.
// Used by the client Payment page, the admin pages, the reminders and the payment API routes,
// so the amount the client sees is exactly the amount Stripe and the e-Transfer check use.
//
//   full      everything before work starts (the default, and the behaviour before payment plans existed)
//   split     a deposit (deposit_percent, default 50) to start, the balance when the site is ready for review
//   on_launch everything when the site is ready for review

export const PAYMENT_PLANS = [
  ["full", "Full amount up front"],
  ["split", "Deposit now, balance at launch"],
  ["on_launch", "Full amount at launch"],
];

const STAGES = ["draft", "submitted", "reviewing", "proposal_sent", "in_progress", "client_review", "completed"];
const LAUNCH_STAGES = ["client_review", "completed"];

export function paymentPlanOf(brief) {
  const plan = brief?.payment_plan;
  return plan === "split" || plan === "on_launch" ? plan : "full";
}

export function depositPercentOf(brief) {
  const value = Number(brief?.deposit_percent);
  return Number.isInteger(value) && value >= 10 && value <= 90 ? value : 50;
}

/** Everything the UI and the API need to know about a project's payments, in cents. */
export function paymentSchedule(brief) {
  const total = Number(brief?.proposal_amount_cents) > 0 ? Math.round(Number(brief.proposal_amount_cents)) : 0;
  // A project marked paid/approved counts as fully paid even when an older flow left amount_paid_cents empty.
  const recorded = Math.max(0, Math.round(Number(brief?.amount_paid_cents) || 0));
  const paid = ["paid", "approved"].includes(brief?.payment_status) ? Math.max(recorded, total) : recorded;
  const plan = paymentPlanOf(brief);
  const percent = depositPercentOf(brief);
  const stage = STAGES.indexOf(brief?.status || "draft");
  const proposalOut = stage >= STAGES.indexOf("proposal_sent");
  const atLaunch = LAUNCH_STAGES.includes(brief?.status);
  const deposit = plan === "split" ? Math.round((total * percent) / 100) : plan === "full" ? total : 0;
  const balance = total - deposit;

  const parts = plan === "split"
    ? [{ key: "deposit", label: `Deposit (${percent}%)`, amount: deposit, when: "To start the work" }, { key: "balance", label: `Balance (${100 - percent}%)`, amount: balance, when: "When your site is ready for review" }]
    : plan === "on_launch"
      ? [{ key: "launch", label: "Full amount", amount: total, when: "When your site is ready for review" }]
      : [{ key: "full", label: "Full amount", amount: total, when: "To start the work" }];

  // Mark each part paid / due / later, filling parts in order with what has been paid.
  let left = paid;
  for (const part of parts) {
    const covered = Math.min(left, part.amount);
    left -= covered;
    part.paid = covered >= part.amount && part.amount > 0;
    const startPart = part.key === "deposit" || part.key === "full";
    part.due = !part.paid && total > 0 && (startPart ? proposalOut : atLaunch);
    part.remaining = part.amount - covered;
  }
  const dueNow = total > 0 ? parts.filter((part) => part.due).reduce((sum, part) => sum + part.remaining, 0) : 0;
  const complete = total > 0 && paid >= total;
  return { total, paid, plan, percent, parts, dueNow, complete, next: parts.find((part) => !part.paid) || null };
}

/** Text for the agreement draft so the contract matches how the client will be asked to pay. */
export function paymentTermsText(brief, formatMoney) {
  const { plan, percent, total } = paymentSchedule(brief);
  if (!total) return "";
  if (plan === "split") return `Payment: ${percent}% (${formatMoney(Math.round((total * percent) / 100))}) to start, ${100 - percent}% (${formatMoney(total - Math.round((total * percent) / 100))}) when the site is ready for review.`;
  if (plan === "on_launch") return `Payment: the full amount (${formatMoney(total)}) when the site is ready for review.`;
  return `Payment: the full amount (${formatMoney(total)}) before work starts.`;
}

/**
 * What the client actually pays for an amount due (in cents), by method.
 * e-Transfer gets BUSINESS.eTransferDiscountPercent off; HST is added on the discounted amount for both
 * methods, but only when BUSINESS.hstNumber is set. `base` is the share of the project price this covers,
 * which is what is recorded in amount_paid_cents, so plans and balances stay in project-price terms.
 */
export function priceForMethod(base, method) {
  const amount = Math.max(0, Math.round(Number(base) || 0));
  const discountPercent = method === "e_transfer" ? Number(BUSINESS.eTransferDiscountPercent) || 0 : 0;
  const discount = Math.round((amount * discountPercent) / 100);
  const subtotal = amount - discount;
  const taxRate = BUSINESS.hstNumber ? Number(BUSINESS.hstRatePercent) || 0 : 0;
  const tax = Math.round((subtotal * taxRate) / 100);
  return { base: amount, discountPercent, discount, subtotal, taxRate, tax, total: subtotal + tax };
}
