import { z } from "zod";

export const createNoteValidator = z.object({
  id: z.string(),
  title: z
    .string()
    .min(3, "Note title must be between 3-16 characters")
    .max(16, "Note title must be between 3-16 characters"),
  content: z
    .string()
    .min(1, "Note can't be empty")
    .max(1000, "Note can't be longer than 1000 characters"),
});
