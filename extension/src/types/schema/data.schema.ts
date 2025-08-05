import { z } from "zod";

const BaseAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export const SignUpSchema = BaseAuthSchema.extend({
  name: z.string().min(3).max(15),
  apiKey: z.string(),
});

export const LoginSchema = BaseAuthSchema;

export type SignUpBodyTypes = z.infer<typeof SignUpSchema>;
export type LoginBodyTypes = z.infer<typeof LoginSchema>;
