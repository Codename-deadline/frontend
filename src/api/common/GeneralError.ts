import z from "zod";

const errorString = z.literal("error");

export const GeneralError = z.object({
  type: errorString,
  detail: z.string().readonly(),
});
