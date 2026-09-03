// Shared notification routing for both dashboard shells.  Notifications can
// carry an explicit deep link; older rows still receive a safe type-based
// destination so historic notifications remain useful.

const clientTabs = {
  overview: "Overview",
  brief: "Project brief",
  project_brief: "Project brief",
  assets: "Assets",
  messages: "Messages",
  approvals: "Approvals",
  handoff: "Handoff & Docs",
  handoff_docs: "Handoff & Docs",
  payments: "Payments",
  profile: "Profile",
};

const adminTabs = {
  action_center: "Action Center",
  actioncenter: "Action Center",
  overview: "Action Center",
  clients: "Clients",
  projects: "Projects",
  brief: "Projects",
  project_brief: "Projects",
  assets: "Projects",
  approvals: "Projects",
  handoff: "Projects",
  handoff_docs: "Projects",
  messages: "Messages",
  payments: "Payments",
};

export function notificationKind(note = {}) {
  const type = String(note.type || "").toLowerCase();
  const text = `${note.title || ""} ${note.message || ""}`.toLowerCase();
  if (type.includes("message") || text.includes("message")) return "message";
  if (type.includes("approval") || text.includes("approval") || text.includes("deliverable")) return "approval";
  if (type.includes("file") || text.includes("file") || text.includes("upload") || text.includes("action required")) return "file_request";
  if (type.includes("payment") || text.includes("payment") || text.includes("transfer") || text.includes("stripe")) return "payment";
  if (type.includes("brief") || text.includes("brief")) return "brief";
  if (type.includes("handoff") || text.includes("handoff") || text.includes("training")) return "handoff";
  return "status_update";
}

function parsedNotificationLink(link) {
  if (!link || typeof link !== "string") return null;
  try {
    return new URL(link, "https://milink.local");
  } catch {
    return null;
  }
}

function fallbackSection(kind, admin) {
  if (admin) {
    if (kind === "message") return "Messages";
    if (kind === "payment") return "Payments";
    if (kind === "brief") return "Action Center";
    return "Projects";
  }
  if (kind === "message") return "Messages";
  if (kind === "file_request") return "Assets";
  if (kind === "approval") return "Approvals";
  if (kind === "payment") return "Payments";
  if (kind === "brief") return "Project brief";
  if (kind === "handoff") return "Handoff & Docs";
  return "Overview";
}

/**
 * Returns one normalized navigation contract for every dashboard
 * notification.  `projectId` is intentionally optional for account-wide
 * conversations, which are not split by project.
 */
export function resolveNotificationNavigation(note, { admin = false } = {}) {
  const kind = notificationKind(note);
  const parsed = parsedNotificationLink(note?.link);
  const params = parsed?.searchParams;
  const requestedTab = String(params?.get("tab") || "").trim().toLowerCase().replace(/-/g, "_");
  const tabMap = admin ? adminTabs : clientTabs;
  const section = tabMap[requestedTab] || fallbackSection(kind, admin);
  const projectId = params?.get("project") || params?.get("project_id") || params?.get("brief_id") || note?.project_id || null;
  const clientId = params?.get("client") || params?.get("client_id") || note?.client_id || (kind === "message" ? note?.sender_id || null : null);
  return { section, kind, projectId, clientId };
}
