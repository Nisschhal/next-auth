import * as z from "zod"

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is Required!" }),
  password: z.string().min(1, { message: "Password is required!" }),
})

// Infer the type from the Zod schema
export type LoginSchemaType = z.infer<typeof LoginSchema>
