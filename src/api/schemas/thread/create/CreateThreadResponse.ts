import z from "zod";

export const CreateThreadResponseSchema = z.object({
  threadId: z.number(),
});

export type CreateThreadResponse = z.infer<typeof CreateThreadResponseSchema>;
