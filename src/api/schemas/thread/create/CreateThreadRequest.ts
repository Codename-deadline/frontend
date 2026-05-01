import z from "zod";

export const CreateThreadRequestSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  usersToAssign: z.array(z.string()),
});

export type CreateThreadRequest = z.infer<typeof CreateThreadRequestSchema>;
