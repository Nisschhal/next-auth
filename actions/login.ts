"use server"

import { LoginSchema, LoginSchemaType } from "@/schemas"
import { signIn } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { AuthError } from "next-auth"
import { getUserByEmail } from "@/data/user.utils"
import { generateVerificationToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/mail"

export const LoginAction = async (
  values: LoginSchemaType
): Promise<{ error?: string; success?: string }> => {
  const validationResults = LoginSchema.safeParse(values)
  if (!validationResults.success) {
    return { error: "Invalid inputs!" }
  }

  const { email, password } = validationResults.data

  // check for user  and email verfied

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid Email or Credentials!" }
  }
  // check for emailverified
  if (!existingUser.emailVerified) {
    const generatedToken = await generateVerificationToken(email)
    await sendVerificationEmail(generatedToken.email, generatedToken.token)
    return { success: "Confirmation Email sent, please verify!" }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
    return { success: "Login successful!" } // Explicit success response
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials!" }
        default:
          return { error: "Something went wrong!" }
      }
    }
    // Rethrow non-AuthError exceptions
    throw error
  }
}

export async function handleGoogleLogin() {
  await signIn("google", {
    callbackUrl: "/settings",
  })
}
export async function handleGithubLogin() {
  await signIn("gihub", {
    callbackUrl: "/settings",
  })
}
