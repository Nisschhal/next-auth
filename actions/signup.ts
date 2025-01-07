"use server"
import bcrypt from "bcrypt"
import { SignupSchema, SignupSchemaType } from "@/schemas"
import { db } from "@/lib/db"
export const SignupAction = async (values: SignupSchemaType) => {
  const validationResuts = SignupSchema.safeParse(values)
  if (!validationResuts.success) {
    return { error: "Invalid inputs!" }
  }

  // validation success
  // extract validated data
  const { email, password, name } = validationResuts.data

  // check for email exit
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  })

  if (existingUser) {
    return { error: "Email already in use!" }
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // save the user

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  // TODO: Send verification token to email

  return { success: "User Created Successful!" }
}
