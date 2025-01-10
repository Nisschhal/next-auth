"use server"
import { getUserByEmail } from "@/data/user"
import {
  getVerificationTokenByEmail,
  getVerificationTokenByToken,
} from "@/data/verificationToken"
import { db } from "@/lib/db"

export default async function verifyUser(
  token: string
): Promise<{ error?: string; success?: string }> {
  console.log(token, "got token here server")
  try {
    // Get the token by token
    const existinToken = await getVerificationTokenByToken(token)

    if (!existinToken) {
      return { error: "Token doesn't exist!" }
    }

    if (existinToken.expires < new Date()) {
      return { error: "Token has expired!" }
    }

    // Verify token and set emailVerified
    const existingUser = await getUserByEmail(existinToken.email)

    // if user has already verfied?
    if (!existingUser || existingUser.emailVerified) {
      return { error: "Invalid Token!" }
    }

    // Delete the token after successful verification
    await db.verificationToken.delete({
      where: { id: existinToken.id },
    })

    // Update user to mark email as verified
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
      },
    })

    return { success: "Email Verified Successfully, please login!" }
  } catch (error) {
    console.error("Error verifying email token:", error)
    return { error: "An unexpected error occurred!" }
  }
}
