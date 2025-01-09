import * as z from "zod"

// SCHEMAS

// LOGIN
export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is Required!" }),
  password: z.string().min(1, { message: "Password is required!" }),
})

// Infer the type from the Zod schema
export type LoginSchemaType = z.infer<typeof LoginSchema>

// SIGN UP
export const SignupSchema = z.object({
  email: z.string().email({ message: "Email is required!" }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters long!" }),
  name: z.string().min(6, { message: "Minimum 5 characters required!" }),
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
