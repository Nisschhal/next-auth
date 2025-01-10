"use server"

import { signIn } from "@/auth"
import {
  deleteTwoFactorTokenById,
  getTwoFactorTokenByEmail,
} from "@/data/twoFactorToken"
import { getUserByEmail } from "@/data/user"
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail"
import {
  generateTwoFactorConfirmation,
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { LoginSchema } from "@/schemas"
import { AuthError } from "next-auth"
import * as z from "zod"
export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalide fields!" }
  }

  const { email, password, code } = validatedFields.data

  // check for correct user
  const existingUser = await getUserByEmail(email)
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email doesn't exist" }
  }

  // check for user verfied
  if (!existingUser.emailVerified) {
    const verficationToken = await generateVerificationToken(email)
    await sendVerificationEmail(verficationToken.email, verficationToken.token)
    // TODO: send email with verification link

    return { success: "Confirmation sent to email!" }
  }

  // check if twofactor enabled and sent code
  if (existingUser.isTwoFactorEnabled) {
    // check if code exist & correct & not expired
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

      if (!twoFactorToken) {
        return { error: "Invalid Code!" }
      }
      if (twoFactorToken.token !== code) {
        return { error: "Wrong Code!" }
      }

      if (twoFactorToken.expires < new Date()) {
        return { error: "Code has expired!" }
      }

      await deleteTwoFactorTokenById(twoFactorToken.id)

      // create confirmation
      await generateTwoFactorConfirmation(existingUser.id)
    } else {
      // if no code send new one
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token)
      return { twoFactor: true, success: "Two Factor Code sent to email!" }
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        // error coming from Credential() provider: authorize() function
        case "CredentialsSignin":
          return { error: "Invalid Credentails" }
        default:
          return { error: "Something went wrong in signIn!" }
      }
    }
    // if not thrown it will not redirect
    throw error
    console.log("Error while login using credentails", error)
  }
  return { success: "Login Success!" }
}
