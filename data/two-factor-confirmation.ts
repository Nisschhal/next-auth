import { db } from "@/lib/db"

/**
 * Fetches VerificaitonToken data based on the given token string
 *
 * @param token - The token will helps find the ResetToken
 * @returns - VerficationToken based on given token
 */
export async function getTwoFactorConfirmationByUserId(userId: string) {
  console.log("clicked")
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId },
    })
    return twoFactorConfirmation
  } catch (error) {
    console.log(
      "Something went wrong while fetching two factor confirmation  tokenByToken",
      error
    )
    return null
  }
}
