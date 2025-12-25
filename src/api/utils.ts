import type { z } from "zod";

export const validateWith =
  <T>(schema: z.ZodSchema<T>) =>
  (raw: unknown) => {
    const r = schema.safeParse(raw);
    return r.success ? { success: true as const, data: r.data } : { success: false as const, error: r.error };
  };
