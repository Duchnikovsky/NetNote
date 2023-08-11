import { z } from "zod";

export const AuthValidator = z.object({
  email: z.string().max(100).min(5),
  password: z.string().max(18).min(8),
});

export type SignInRequest = z.infer<typeof AuthValidator>;