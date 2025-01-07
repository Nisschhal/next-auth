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
  email: z.string().email({ message: "Email is Required!" }),
  password: z.string().min(1, { message: "Password is required!" }),
  name: z.string().min(1, { message: "Name is required!" }),
})

// Infer type for signup schema
export type SignupSchemaType = z.infer<typeof SignupSchema>
