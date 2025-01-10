import { db } from "@/lib/db"

/**
 * Fetches a two factor token based on the provided email.
 *
 * @param email - The email to find the associated two factor token for.
 * @returns - Returns the two factor token if found, otherwise null.
 */
export async function getTwoFactorTokenByEmail(email: string) {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email },
    })
    return twoFactorToken
  } catch (error) {
    console.error("Error fetching two factor token by email:", error)
    return null
  }
}

/**
 * Fetches Two Factor Token data based on the given token string
 *
 * @param token - The token will helps find the ResetToken
 * @returns - VerficationToken based on given token
 */
export async function getTwoFactorTokenByToken(token: string) {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token },
    })
    return twoFactorToken
  } catch (error) {
    console.log(
      "Something went wrong while fetching two factor tokenByToken",
      error
    )
    return null
  }
}
/**
 * Delets Two factor Token data based on the given token string
 *
 * @param token - The token will helps find the ResetToken
 * @returns - VerficationToken based on given token
 */
export async function deleteTwoFactorTokenById(id: string) {
  try {
    const twoFactorToken = await db.twoFactorToken.delete({
      where: { id },
    })
    return twoFactorToken
  } catch (error) {
    console.log(
      "Something went wrong while deleting two factor tokenById",
      error
    )
    return null
  }
}
