import { createSafeFetch, type NormalizedError } from "@asouei/safe-fetch";
import { GeneralErrorSchema } from "@/api/common/GeneralError";

const env = import.meta.env;

export const client = createSafeFetch({
  baseURL: env.VITE_API_BASE_URL,
  timeoutMs: 5000,
  totalTimeoutMs: 30000,
  retries: {
    retries: 2,
    baseDelayMs: 500,
  },
  interceptors: {
    onRequest: (_, init) => {
      const headers = new Headers(init.headers);
      const token: string = localStorage.getItem("accessToken") ?? localStorage.getItem("refreshToken") ?? "";
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
      }
    },
    onError: async (error: NormalizedError) => {
      if (error.name !== "HttpError") return;

      if (error.status === 401) {
        if (window.location.href.includes("auth")) return;
        localStorage.removeItem("accessToken");
        return;
      }
      const parsed = GeneralErrorSchema.safeParse(error.body);
      if (parsed.success) {
        console.error(`[API]: Code: ${parsed.data.code}, details: ${parsed.data.detail ?? "none"}`);
      } else {
        console.error(`[API]: Status: ${error.status}, failed to parse: ${parsed.error}`);
      }
    },
  },
});
