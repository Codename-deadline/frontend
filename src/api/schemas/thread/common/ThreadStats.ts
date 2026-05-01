import z from "zod";

export const ThreadStatsSchema = z.object({
  assignees: z.number(),
  deadlines: z.number(),
});

export type ThreadStats = z.infer<typeof ThreadStatsSchema>;
