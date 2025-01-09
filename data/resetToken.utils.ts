import { db } from "@/lib/db"

/**
 * Fetches a Reset token based on the provided email.
 *
 * @param email - The email to find the associated Reset token for.
 * @returns - Returns the Reset token if found, otherwise null.
 */
export async function getResetTokenByEmail(email: string) {
  try {
    const ResetToken = await db.restPasswordToken.findFirst({
      where: { email },
    })
    return ResetToken
  } catch (error) {
    console.error("Error fetching Reset token by email:", error)
    return null
  }
}

/**
 * Fetches VerificaitonToken data based on the given token string
 *
 * @param token - The token will helps find the ResetToken
 * @returns - VerficationToken based on given token
 */
export async function getResetTokenByToken(token: string) {
  console.log("clicked")
  try {
    const ResetToken = await db.restPasswordToken.findUnique({
      where: { token },
    })
    console.log(ResetToken, "token")
    return ResetToken
  } catch (error) {
    console.log("Something went wrong while fetching reset tokenByToken", error)
    return null
  }
}
