"use server"
import { getUserByEmail } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/mail"
import { generateVerificationToken } from "@/lib/tokens"
import { SettingSchema } from "@/schemas"
import * as z from "zod"
import bcryptjs from "bcryptjs"

export const settings = async (values: z.infer<typeof SettingSchema>) => {
  const user = await currentUser()
  if (!user) return { error: "Unauthorized!" }

  const dbUser = await getUserByEmail(user.email!)
  if (!dbUser) return { error: "Unauthorized!" }

  // Handle OAuth users
  if (user.isOAuth) {
    const { email, password, newPassword, isTwoFactorEnabled, ...rest } = values
    values = rest
  }

  // Email update
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email)

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" }
    }

    const verificationToken = await generateVerificationToken(values.email)
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )
    values.emailVerified = null
  }

  // Password update
  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcryptjs.compare(
      values.password,
      dbUser.password
    )
    if (!passwordMatch) return { error: "Incorrect Password!" }

    const hashedNewPassword = await bcryptjs.hash(values.newPassword, 10)
    values.password = hashedNewPassword
    values.newPassword = undefined
  }

  // Update user settings
  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: { ...values },
  })

  if (updatedUser.email !== user.email) {
    console.log(updatedUser.email, user.email)
    return { success: "Settings Updated and Verfication Sent to new Email!" }
  }

  return { success: "Settings Updated!" }
}
