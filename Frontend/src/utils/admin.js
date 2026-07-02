// Client-side admin gate. This is a demo/localStorage app with no backend
// roles, so admin access is limited to a known set of emails.
export const ADMIN_EMAILS = ["aiamitcaoffice@gmail.com"];

export function isAdmin(user) {
  return Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));
}
