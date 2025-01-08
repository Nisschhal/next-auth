import { db } from "@/lib/db"

/**
 * Fetches a verification token based on the provided email.
 *
 * @param email - The email to find the associated verification token for.
 * @returns - Returns the verification token if found, otherwise null.
 */
export async function getVerificationTokenByEmail(email: string) {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    })
    return verificationToken
  } catch (error) {
    console.error("Error fetching verification token by email:", error)
    return null
  }
}

/**
 * Fetches VerificaitonToken data based on the given token string
 *
 * @param token - The token will helps find the verificationToken
 * @returns - VerficationToken based on given token
 */
export async function getVerificationTokenByToken(token: string) {
  console.log("clicked")
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    })
    console.log(verificationToken, "token")
    return verificationToken
  } catch (error) {
    console.log("Something went wrong while fetching tokenByToken", error)
    return null
  }
}
