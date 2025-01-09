// generate token
import {
  getResetTokenByEmail,
  getResetTokenByToken,
} from "@/data/resetToken.utils"
import { v4 as uuidv4 } from "uuid"
import { db } from "./db"

/**
 * Generates reset token
 * @param email - links `email` with genereated `token`
 * @returns - returns `token` object: `id, token, email, expires`
 */
export const generateResetToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getResetTokenByEmail(email)

  if (existingToken) {
    await db.restPasswordToken.delete({ where: { id: existingToken.id } })
  }

  const ResetToken = await db.restPasswordToken.create({
    data: {
      token,
      email,
      expires,
    },
  })

  return ResetToken
}

/**
 * Delete Reset Token based on the given token
 * @param token - to identify the token
 * @returns - boolean
 */
export const deleteResetToken = async (token: string) => {
  try {
    const existingToken = await getResetTokenByToken(token)

    if (existingToken) {
      await db.restPasswordToken.delete({ where: { id: existingToken.id } })
    }
    return true
  } catch (error) {
    console.log("Error while deleting reset token", error)
    return false
  }
}
