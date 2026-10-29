// The owner accounts that are always administrators (the bootstrap admins).
// Every other administrator is made by setting `profiles.role` to "admin" or
// "super_admin" in the database; the API routes, the database policies and the
// admin workspace all read that role, so this list is only the safety net.
export const ADMIN_EMAILS = ["miladmo68@gmail.com", "info@milink.ca"];
export const ADMIN_EMAIL_SET = new Set(ADMIN_EMAILS);

export const isAdminEmail = (email) => ADMIN_EMAIL_SET.has(String(email || "").trim().toLowerCase());
export const isAdminRole = (role) => role === "admin" || role === "super_admin";
