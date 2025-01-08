"use server"
import bcrypt from "bcrypt"
import { SignupSchema, SignupSchemaType } from "@/schemas"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user.utils"
import { generateVerificationToken } from "@/lib/token"

/**
 * Handles the signup action for a new user.
 *
 * @param {SignupSchemaType} values - The input values for signup, including `name`, `email`, and `password`.
 * @returns {Promise<{ error?: string; success?: string }>} - Returns a promise that resolves to an object containing either an `error` message or a `success` message.
 */
export const SignupAction = async (
  values: SignupSchemaType
): Promise<{ error?: string; success?: string }> => {
  // Validate the input
  const validationResuts = SignupSchema.safeParse(values)
  if (!validationResuts.success) {
    return { error: "Invalid inputs!" }
  }

  // Validation success - extract validated data
  const { email, password, name } = validationResuts.data

  // Check for email existence
  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: "Email already in use!" }
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Save the user
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  // Generate verification token
  const generatedToken = await generateVerificationToken(email)

  // TODO: Send verification token to email

  return { success: "Verification Link Sent to Email!" }
}
