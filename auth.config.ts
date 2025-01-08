import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "./schemas"
import { db } from "./lib/db"
import { getUserByEmail } from "./data/user.utils"

export default {
  providers: [
    // IF somehow user | hacker made it there without proper login form validation then validate once again

    Credentials({
      async authorize(credentials) {
        const validateFields = await LoginSchema.safeParse(credentials)

        if (validateFields.success) {
          const { email, password } = validateFields.data

          const user = await getUserByEmail(email)

          // user with oauth link, not a traditional user of username/password
          if (!user || !user.password) return null

          const passwordMatch = await bcrypt.compare(password, user.password)

          if (passwordMatch) return user
        }
        return null
      },
    }),
  ],
} satisfies NextAuthConfig
