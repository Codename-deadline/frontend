import z from "zod";
import { AuthMethod } from "@/types/AuthMethod";
import { Language } from "@/types/Language";

export const SignUpRequestSchema = z.object({
  identifier: z.string().min(1).max(255),
  username: z.string().min(1).max(255),
  fullName: z.string().min(1).max(255),
  language: z.enum(Object.values(Language)),
  channel: z.enum(Object.keys(AuthMethod)),
});

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;
