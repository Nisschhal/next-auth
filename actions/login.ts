"use server"

import { LoginSchema, LoginSchemaType } from "@/schemas"

export const LoginAction = async (values: LoginSchemaType) => {
  const validationResuts = LoginSchema.safeParse(values)
  if (!validationResuts.success) {
    return { error: "Invalid inputs!" }
  }

  return { success: "Login Successful!" }
}
