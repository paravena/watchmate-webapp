import { z } from 'zod'

export const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const SignupSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  email: z.string().email(),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type SignupInput = z.infer<typeof SignupSchema>
