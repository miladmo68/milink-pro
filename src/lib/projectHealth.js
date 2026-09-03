/**
 * A small, deterministic health signal for an agency project.
 *
 * Thresholds intentionally favour a neutral result for brand-new work:
 * - Active projects are considered stale after 7 quiet days.
 * - Pending approvals/file requests become attention items after 3 days
 *   and risks after 7 days.
 * - A submitted e-Transfer becomes a risk after 3 days because it needs
 *   an explicit bank-side verification.
 * - A client message becomes an attention item after 2 days without a
 *   later admin reply, and a risk after 4 days.
 *
 * This has no side effects and is deliberately isolated so its thresholds
 * can be tuned (or replaced with a richer model) without touching UI code.
 */

const DAY = 24 * 60 * 60 * 1000;
const ACTIVE_STATUSES = new Set(["submitted", "reviewing", "proposal_sent", "in_progress", "client_review"]);

const timestamp = value => {
  const time = new Date(value || 0).getTime();
  return Number.isFinite(time) ? time : 0;
};

const ageInDays = (value, now) => {
  const time = timestamp(value);
  return time ? Math.max(0, (now - time) / DAY) : 0;
};

const latest = (items, predicate = () => true) =>
  (items || []).filter(predicate).reduce((current, item) => {
    return timestamp(item?.created_at) > timestamp(current?.created_at) ? item : current;
  }, null);

const result = (level, reason, priority) => ({ level, reason, priority });

export function computeProjectHealth({ brief, messages = [], approvals = [], fileRequests = [], adminIds = [], now = Date.now() } = {}) {
  if (!brief?.id || brief.status === "draft") return result("neutral", "Health tracking begins once the project is submitted.", 0);

  const adminSet = new Set((adminIds || []).filter(Boolean));
  const clientId = brief.client_id;
  const latestClientMessage = latest(messages, message => message?.sender_id === clientId);
  const latestAdminMessage = latest(messages, message => adminSet.has(message?.sender_id));
  const clientWaitingDays = latestClientMessage && timestamp(latestClientMessage.created_at) > timestamp(latestAdminMessage?.created_at)
    ? ageInDays(latestClientMessage.created_at, now)
    : 0;

  const pendingApproval = latest(approvals, approval => approval?.status === "pending");
  const pendingFileRequest = latest(fileRequests, request => {
    const decision = request?.admin_decision || "pending";
    return !["completed", "cancelled", "dismissed", "accepted"].includes(request?.status) && !["accepted", "dismissed"].includes(decision);
  });
  const approvalAge = ageInDays(pendingApproval?.created_at, now);
  const fileRequestAge = ageInDays(pendingFileRequest?.created_at, now);
  const transferAge = brief.payment_status === "e_transfer_submitted" ? ageInDays(brief.e_transfer_submitted_at || brief.updated_at, now) : 0;

  const updates = Array.isArray(brief.timeline_updates) ? brief.timeline_updates : [];
  const latestUpdate = latest(updates);
  const activeProject = ACTIVE_STATUSES.has(brief.status);
  const inactivityDays = activeProject ? ageInDays(latestUpdate?.created_at || brief.updated_at || brief.created_at, now) : 0;

  if (transferAge >= 3) return result("at_risk", "Submitted e-Transfer has not been confirmed for over 3 days.", 100);
  if (clientWaitingDays >= 4) return result("at_risk", `Client is waiting for a reply for ${Math.floor(clientWaitingDays)} days.`, 90);
  if (approvalAge >= 7) return result("at_risk", "Client approval has been waiting for over 7 days.", 80);
  if (fileRequestAge >= 7) return result("at_risk", "Requested client file has been pending for over 7 days.", 75);
  if (brief.status === "in_progress" && inactivityDays >= 10) return result("at_risk", "No timeline update has been posted for over 10 days.", 70);

  if (clientWaitingDays >= 2) return result("needs_attention", `Client is waiting for a reply for ${Math.floor(clientWaitingDays)} days.`, 60);
  if (approvalAge >= 3) return result("needs_attention", "A client approval has been awaiting a decision for over 3 days.", 55);
  if (fileRequestAge >= 3) return result("needs_attention", "A requested client file has been pending for over 3 days.", 50);
  if (brief.status === "in_progress" && inactivityDays >= 7) return result("needs_attention", "No progress update has been posted in 7 days.", 45);

  if (activeProject || brief.status === "completed") return result("on_track", brief.status === "completed" ? "Project has reached its completed stage." : "No current delivery or communication risks were detected.", 10);
  return result("neutral", "Health tracking begins once the project is active.", 0);
}
