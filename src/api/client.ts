import { createSafeFetch } from "@asouei/safe-fetch";
import { useRouter } from "vue-router";
import { GeneralError } from "@/api/common/GeneralError";

const env = import.meta.env;

export const client = createSafeFetch({
  baseURL: env.VITE_API_BASE_URL,
  timeoutMs: 5000,
  totalTimeoutMs: 30000,
  retries: {
    retries: 2,
    baseDelayMs: 300,
  },
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  interceptors: {
    onRequest: (_, init) => {
      const headers = new Headers(init.headers);
      const token: string = localStorage.getItem("access-token") || "";
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
      }
    },
    onResponse: async (response) => {
      if (response.status === 401) {
        useRouter().push("/login");
      } else if (!response.ok) {
        const error = GeneralError.safeParse(await response.json());
        if (error.success) {
          console.error(`${response.url} status: ${response.status}, details: ${error.data.detail}`);
        } else {
          console.error(`${response.url} status: ${response.status}, failed to parse: ${error.error}`);
        }
      }
    },
  },
});
