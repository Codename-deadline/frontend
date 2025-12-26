import type { SafeResult } from "@asouei/safe-fetch";
import type { z } from "zod";
import type { FormErrors, SafeApiCall } from "@/types/api";

type ZodIssue = z.ZodError["issues"][number];

export const validateWith =
  <T>(schema: z.ZodType<T>) =>
  (raw: unknown) => {
    const r = schema.safeParse(raw);
    return r.success ? { success: true as const, data: r.data } : { success: false as const, error: r.error };
  };

export const validateAndRequest = async <TInput, TOutput>(
  schema: z.ZodType<TInput>,
  input: unknown,
  request: (data: TInput) => Promise<SafeResult<TOutput>>,
): Promise<SafeApiCall<TOutput>> => {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      reason: "validation",
      error: parsed.error,
    };
  }

  const result = await request(parsed.data);
  if (!result.ok) {
    return {
      ok: false,
      reason: "api",
      error: result,
    };
  }

  return { ok: true, data: result.data };
};

const extractParams = (issue: ZodIssue) => {
  switch (issue.code) {
    case "too_small":
      return { min: issue.minimum };
    case "too_big":
      return { max: issue.maximum };
    case "invalid_type":
      return { expected: issue.expected };
    default:
      return undefined;
  }
};

export const parseZodError = (error: z.ZodError): FormErrors => {
  const errors: FormErrors = {};

  for (const issue of error.issues) {
    const field = issue.path.join(".") || "_form";

    if (!errors[field]) {
      errors[field] = [];
    }

    errors[field].push({
      code: issue.code,
      params: extractParams(issue),
    });
  }

  return errors;
};
