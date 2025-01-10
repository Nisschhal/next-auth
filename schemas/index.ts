import { UserRoles } from "@prisma/client"
import * as z from "zod"

// SCHEMAS
// Settings
// LOGIN
export const SettingSchema = z
  .object({
    name: z.string().min(3, { message: "Minimum 3 characters required!" }),
    email: z.string().email({ message: "Email is Required!" }),
    password: z
      .string()
      .min(5, { message: "Password must be at least 5 characters long!" }),
    password1: z
      .string()
      .min(5, { message: "Password must be at least 5 characters long!" }),
    role: z.enum([UserRoles.ADMIN, UserRoles.USER]),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password1) {
      ctx.addIssue({
        path: ["password1"], // Points to the `password1` field
        message: "Passwords must match!",
        code: "custom",
      })
    }
  })

// LOGIN
export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is Required!" }),
  password: z.string().min(1, { message: "Password is required!" }),
  code: z.optional(z.string()),
})

// Infer the type from the Zod schema
export type LoginSchemaType = z.infer<typeof LoginSchema>

// SIGN UP
export const SignupSchema = z.object({
  email: z.string().email({ message: "Email is required!" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long!" }),
  name: z.string().min(3, { message: "Minimum 3 characters required!" }),
})

// Infer type for signup schema
export type SignupSchemaType = z.infer<typeof SignupSchema>

// RESET PASSWORD
export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is required!" }),
})

export type ResetSchemaType = z.infer<typeof ResetSchema>

// New PASSWORD Schema
export const NewPasswordSchema = z
  .object({
    password: z.string().min(3, {
      message: "Password must be at least 3 characters long!",
    }),
    password1: z.string().min(3, {
      message: "Password must be at least 3 characters long!",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password1) {
      ctx.addIssue({
        path: ["password1"], // Points to the `password1` field
        message: "Passwords must match!",
        code: "custom",
      })
    }
  })

export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>
