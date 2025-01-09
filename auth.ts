import { PrismaAdapter } from "@auth/prisma-adapter"
import { db, db as prisma } from "@/lib/db"
import authConfig from "./auth.config"
import { getUserByEmail, getUserByIdWithoutPassword } from "./data/user.utils"
import NextAuth from "next-auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/erro",
  }, // events for linked accounts
  events: {
    // activate when google | google provider activates
    async linkAccount({ user }) {
      const existingUser = await db.user.findUnique({
        where: {
          id: user.id,
        },
      })

      // if such user exist
      if (existingUser) {
        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            emailVerified: new Date(),
          },
        })
      }
    },
  },

  // for jwt and session
  callbacks: {
    // use if you need to handle sign in false if user is not verfied and so on.
    async signIn({ user, profile, account }) {
      if (account?.type !== "credentials") return true
      // if user somehow tries to login even though not verified return fasle
      const existingUser = await getUserByEmail(user.email!)
      if (!existingUser?.emailVerified) return false

      // check for two factor confirmation
      // TODO: if got confrimation delete it

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
