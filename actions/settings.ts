"use server"
import { getUserByEmail } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { SettingSchema } from "@/schemas"
import * as z from "zod"

export const settings = async (values: z.infer<typeof SettingSchema>) => {
  const user = await currentUser()

  if (!user) {
    return { error: "Unauthorized !" }
  }

  const dbUser = await getUserByEmail(user.email!)

  if (!dbUser) {
    return { error: "Unauthorized !" }
  }

  const validatedFields = SettingSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid Inputs!" }
  }

  await db.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      ...values,
    },
  })

  return { success: "Settings Updated!" }
}
