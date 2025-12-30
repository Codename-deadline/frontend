import z from "zod";
import { IsoUtcDateSchema } from "./IsoUtcDate";
import { UserSchema } from "./User";

export const MemberSchema = z.object({
  user: UserSchema,
  assignedAt: IsoUtcDateSchema,
});

export type Member = z.infer<typeof UserSchema>;
