"use server"
import bcrypt from "bcryptjs"
import { SignupSchema } from "@/schemas"
import * as z from "zod"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"

export const register = async (values: z.infer<typeof SignupSchema>) => {
  const validatedFields = SignupSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalide fields!" }
  }

  const { email, password, name } = validatedFields.data

  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) return { error: "Email already in use!" }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  // TODO: send verification token
  const verficationToken = await generateVerificationToken(email)
  await sendVerificationEmail(verficationToken.email, verficationToken.token)
  // TODO: send email with verification link

  return { success: "Registration Complete, Confirmation sent to email!" }
}
