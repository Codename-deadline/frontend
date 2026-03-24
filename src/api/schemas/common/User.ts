import z from "zod";
import { IsoUtcDateSchema } from "./IsoUtcDate";
import { LanguageSchema } from "./LanguageSchema";

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  fullName: z.string(),
  joinedAt: IsoUtcDateSchema,
  language: LanguageSchema,
});

export type User = z.infer<typeof UserSchema>;
