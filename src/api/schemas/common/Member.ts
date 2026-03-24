import z from "zod";
import type { AnyRole } from "@/types/scope";
import { IsoUtcDateSchema } from "./IsoUtcDate";
import { UserSchema } from "./User";

export const MemberSchema = z.object({
  user: UserSchema,
  assignedAt: IsoUtcDateSchema,
});

export type Member = z.infer<typeof MemberSchema>;
export type MemberWithRole = Member & { role: AnyRole };
