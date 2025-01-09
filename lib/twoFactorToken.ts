// generate token
import {
  getVerificationTokenByEmail,
  getVerificationTokenByToken,
} from "@/data/token.utils"
import { v4 as uuidv4 } from "uuid"
import {} from "uuid"
import { db } from "./db"
import crpyto from "crypto"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token.utils"

/**
 * Generates Two factor token and save to database
 * @param email - Email to verify token
 * @returns - returns generate two factor Object including: `token, email, expires`
 */
export const generateTwoFactorToken = async (email: string) => {
  const token = crpyto.randomInt(100_000, 1_000_000).toString()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getTwoFactorTokenByEmail(email)

  if (existingToken) {
    await db.twoFactorToken.delete({ where: { id: existingToken.id } })
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      token,
      email,
      expires,
    },
  })

  return twoFactorToken
}
