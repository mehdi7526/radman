export async function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = typeof window === "undefined" ? null : window.localStorage.getItem("radman_access_token");
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}
