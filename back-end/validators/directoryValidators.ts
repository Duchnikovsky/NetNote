import { z } from "zod";

export const createDirectoryValidator = z.object({
  name: z
    .string()
    .min(3, "Directory name must be between 3-16 characters")
    .max(16, "Directory name must be between 3-16 characters"),
});

export const editDirectoryValidator = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, "Directory name must be between 3-16 characters")
    .max(16, "Directory name must be between 3-16 characters"),
});
