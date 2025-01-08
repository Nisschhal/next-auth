import { db } from "@/lib/db"

export async function getVerficationTokenByEmail(email: string) {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    })
    return verificationToken
  } catch (error) {
    console.log("Something went wrong while fetching tokenByEmail", error)
    return null
  }
}
export async function getVerificationTokenByToken(token: string) {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    })
    return verificationToken
  } catch (error) {
    console.log("Something went wrong while fetching tokenByToken", error)
    return null
  }
}
