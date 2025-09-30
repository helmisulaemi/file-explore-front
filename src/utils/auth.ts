// utils/auth.ts
export function isAuthenticated() {
  return !!localStorage.getItem("token"); // true kalau ada token
}
