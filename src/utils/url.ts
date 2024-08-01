// url.ts
export const api = {
  baseURL:
  process.env.NEXT_PUBLIC_BASE_URL ||
  (typeof window !== "undefined" ? window.location.origin : ""),
};
