import { db } from "@/lib/db"

/**
 * Fetches a reset token based on the provided email.
 *
 * @param email - The email to find the associated reset token for.
 * @returns - Returns the reset token if found, otherwise null.
 */
export async function getResetTokenByEmail(email: string) {
  try {
    const resetToken = await db.restPasswordToken.findFirst({
      where: { email },
    })
    return resetToken
  } catch (error) {
    console.error("Error fetching verification token by email:", error)
    return null
  }
}

/**
 * Fetches reset token data based on the given token string
 *
 * @param token - The token will helps find the reset token
 * @returns - reset token object based on given token
 */
export async function getResetTokenByToken(token: string) {
  console.log("clicked")
  try {
    const resetToken = await db.restPasswordToken.findUnique({
      where: { token },
    })
    return resetToken
  } catch (error) {
    console.log("Something went wrong while fetching tokenByToken", error)
    return null
  }
}

/**
 * Delets Two factor Token data based on the given token string
 *
 * @param token - The token will helps find the ResetToken
 * @returns - VerficationToken based on given token
 */
export async function deleteResetTokenById(id: string) {
  try {
    const resetToken = await db.restPasswordToken.delete({
      where: { id },
    })
    console.log({ resetToken })
    return resetToken
  } catch (error) {
    console.log(
      "Something went wrong while deleting two factor tokenById",
      error
    )
    return null
  }
}
