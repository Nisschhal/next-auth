"use server"

import { LoginSchema, LoginSchemaType } from "@/schemas"
import { signIn } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { AuthError } from "next-auth"
import { getUserByEmail } from "@/data/user.utils"
import { generateVerificationToken } from "@/lib/token"
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail"
import { generateTwoFactorToken } from "@/lib/twoFactorToken"
import { generateTwoFactorConfirmation } from "@/lib/twoFactorConfirmation"
import {
  deleteTwoFactorTokenById,
  getTwoFactorTokenByEmail,
  getTwoFactorTokenByToken,
} from "@/data/two-factor-token.utils"

export const LoginAction = async (
  values: LoginSchemaType
): Promise<{ error?: string; success?: string; showTwoFactor?: boolean }> => {
  console.log("clicked")
  const validationResults = LoginSchema.safeParse(values)
  console.log({ values })
  if (!validationResults.success) {
    return { error: "Invalid inputs!" }
  }

  const { email, password, code } = validationResults.data

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

  if (existingUser.isTwoFactorEnabled) {
    // if there is no Two factor Code
    if (code) {
      const existingTwoFactorCode = await getTwoFactorTokenByEmail(email)

      if (!existingTwoFactorCode) {
        return { error: "Invalid Code" }
      }
      if (existingTwoFactorCode.token !== code) {
        console.log("toknes", existingTwoFactorCode.token, code)
        return { error: "Wrong Code!" }
      }
      if (existingTwoFactorCode.expires < new Date()) {
        return { error: "Code has expired!" }
      }

      await deleteTwoFactorTokenById(existingTwoFactorCode.id)

      await generateTwoFactorConfirmation(existingUser.id)
    } else {
      // check for the twofactor
      const generatedTwoFactorToken = await generateTwoFactorToken(email)
      await sendTwoFactorEmail(
        generatedTwoFactorToken.email,
        generatedTwoFactorToken.token
      )
      return { showTwoFactor: true, success: "Two Factor code sent to email!" }
    }
  }

  // if (existingUser.isTwoFactorEnabled) {
  //   const generatedTwoFactorToken = await generateTwoFactorToken(email)
  //   await sendTwoFactorEmail(
  //     generatedTwoFactorToken.email,
  //     generatedTwoFactorToken.token
  //   )
  //   return { showTwoFactor: true, success: "Two Factor code sent to email!" }
  // }

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
