"use server"

import { SignupSchema, SignupSchemaType } from "@/schemas"

export const SignupAction = async (values: SignupSchemaType) => {
  const validationResuts = SignupSchema.safeParse(values)
  if (!validationResuts.success) {
    return { error: "Invalid inputs!" }
  }

  return { success: "Register Successful!" }
}
