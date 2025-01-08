// generate token
import {
  getVerficationTokenByEmail,
  getVerificationTokenByToken,
} from "@/data/token.utils"
import { v4 as uuidv4 } from "uuid"
import {} from "uuid"
import { db } from "./db"

/**
 *
 * @param email -
 * @returns
 */
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getVerficationTokenByEmail(email)
  if (existingToken) {
    db.verificationToken.delete({ where: { id: existingToken.id } })
  }

  const newToken = await db.verificationToken.create({
    data: {
      token,
      email,
      expires,
    },
  })

  return newToken
}

// verify token

// const verfyToken = async (token: string) => {
//   // check for token
//   const existingToken = await getVerificationTokenByToken(token)
//   if (existingToken) {
//     if (existingToken.expires < new Date()
//   }
//   // check of date
// }
