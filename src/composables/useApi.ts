import { parseZodError } from "@/api/utils";
import type { ApiError, FormErrors, SafeApiCall } from "@/types/api";
import type { OperationResult } from "@/types/OperationResult";

export function useApi() {
  const makeRequest = async <T>(
    request: () => Promise<SafeApiCall<T>>,
    displayValidationError: (error: FormErrors) => void,
    displayApiError: (error: ApiError) => void,
  ): Promise<OperationResult<T>> => {
    const result = await request();

    if (!result.ok) {
      if (result.reason === "validation") {
        displayValidationError(parseZodError(result.error));
      } else {
        displayApiError(result.error);
      }
      return { ok: false };
    }

    return { ok: true, data: result.data };
  };

  return { makeRequest };
}
