import { z } from "zod";

export const signInValidator = z.object({
  email: z
    .string()
    .max(100, "Email has to be valid")
    .min(5, "Email has to be valid")
    .email("Email has to be valid"),
  password: z
    .string()
    .max(18, "Password must be between 8-18 characters")
    .min(8, "Password must be between 8-18 characters"),
});

export const signUpValidator = z.object({
  email: z
    .string()
    .max(100, "Email has to be valid")
    .min(5, "Email has to be valid")
    .email("Email has to be valid"),
  password: z
    .string()
    .max(18, "Password must be between 8-18 characters")
    .min(8, "Password must be between 8-18 characters"),
});
