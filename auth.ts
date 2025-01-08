import { PrismaAdapter } from "@auth/prisma-adapter"
import { db as prisma } from "@/lib/db"
import authConfig from "./auth.config"
import { getUserByIdWithoutPassword } from "./data/user.utils"
import NextAuth from "next-auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    // use if you need to handle sign in false if user is not verfied and so on.
    async signIn({ user, profile, account }) {
      return true
    },

    // attach the role to token from user
    async jwt({ token, session }) {
      if (!token.sub) return token

      const exitingUser = await getUserByIdWithoutPassword(token.sub)

      if (!exitingUser) return token

      // add role to toke to pass to session
      token.role = exitingUser.role

      return token
    },

    // attach the role to user session
    session({ token, session }) {
      // add id to session
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      // add role to session
      if (token.role && session.user) {
        session.user.role = token.role
      }

      return session
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})
