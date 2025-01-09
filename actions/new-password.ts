"use server"
import {
  NewPasswordSchema,
  NewPasswordSchemaType,
  ResetSchema,
  ResetSchemaType,
} from "@/schemas"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user.utils"
import { deleteResetToken } from "@/lib/resetToken"
import { getResetTokenByToken } from "@/data/resetToken.utils"
import bcrypt from "bcryptjs"
/**
 * Handles the new password action
 *
 * @param {NewPasswordSchemaType} values - The input values for reset, including `password`
 * @returns {Promise<{ error?: string; success?: string }>} - Returns a promise that resolves to an object containing either an `error` message or a `success` message.
 */
export const NewPasswordAction = async (
  values: NewPasswordSchemaType,
  token: string
): Promise<{ error?: string; success?: string }> => {
  if (!token) {
    return { error: "No Reset Token Provided!" }
  }
  // Validate the input
  const validationResuts = NewPasswordSchema.safeParse(values)

  if (!validationResuts.success) {
    return { error: "Invalid inputs!" }
  }

  // Validation success - extract validated data
  const { password } = validationResuts.data

  // get the reset token
  const resetToken = await getResetTokenByToken(token)

  if (!resetToken) {
    return { error: "Invalid Reset Token!" }
  }
  if (resetToken.expires < new Date()) {
    return { error: "Token has expired!" }
  }

  // Check for email existence
  const existingUser = await getUserByEmail(resetToken.email)

  if (!existingUser) {
    return { error: "User doesn't exit!" }
  }

  // Delete reset token
  const isTokenDeleted = await deleteResetToken(token)

  if (!isTokenDeleted) return { error: "Couldn't reset password!" }

  // change the password : hash - > update the user's password
  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
    },
  })

  return { success: "Password changed Successfully!" }
}
