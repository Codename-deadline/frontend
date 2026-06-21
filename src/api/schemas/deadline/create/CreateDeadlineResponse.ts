import z from "zod";

export const CreateDeadlineResponseSchema = z.object({
  deadlineId: z.number(),
  assignees: z.number(),
});

export type CreateDeadlineResponse = z.infer<typeof CreateDeadlineResponseSchema>;
