"use server"

import { LoginSchema, LoginSchemaType } from "@/schemas"
import { signIn } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { AuthError } from "next-auth"

export const LoginAction = async (
  values: LoginSchemaType
): Promise<{ success: string | null; error: string | null }> => {
  const validationResults = LoginSchema.safeParse(values)
  if (!validationResults.success) {
    return { success: null, error: "Invalid inputs!" }
  }

  const { email, password } = validationResults.data

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
    return { success: "Login successful!", error: null } // Explicit success response
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: null, error: "Invalid Credentials!" }
        default:
          return { success: null, error: "Something went wrong!" }
      }
    }
    // Rethrow non-AuthError exceptions
    throw error
  }
}
