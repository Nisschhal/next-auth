import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import authConfig from "./auth.config"
import { db } from "./lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getUserById } from "./data/user"
import {
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId,
} from "./data/twoFactorConfirmation"

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    // only activate once per new account link so make sure emailVerfied is updated
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      })
    },
  },
  callbacks: {
    // extra check befor signing
    async signIn({ user, account }) {
      // if user somehow login via provider other than credential: googel or github then retun immediately
      if (account?.type !== "credentials") return true

      // if user is not verfied as well then bloc k
      const exisingUser = await getUserById(user.id!)
      if (!exisingUser?.emailVerified) return false

      // check for twofactor confirmation
      const confirmation = await getTwoFactorConfirmationByUserId(
        exisingUser.id
      )
      console.log({ confirmation })
      if (confirmation) {
        deleteTwoFactorConfirmation(exisingUser.id)
      }

      return true
    },

    // set the user role to token
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      token.name = existingUser.name!
      token.email = existingUser.email
      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

      console.log({ token })
      return token
    },
    async session({ token, session }) {
      // add the userId to session.user object as it only contains: name, email,
      if (token.sub && session.user) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      if (token.role && session.user) {
        session.user.role = token.role
      }

      // add two factor props as well in session user but don't check as it returns "false" value
      // so just add it in user
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled
        session.user.name = token.name
        session.user.email = token.email
      }
      console.log({ session, token })
      return session
    },
  },

  adapter: PrismaAdapter(db),
  // callbacks: {},
  session: { strategy: "jwt" },
  ...authConfig,
})

// Auth config is used because edge doesn't support prisma so to use callbacks with prisma we need to wrap auth.config.ts with auth.ts
// and then we can safely use callbacks with prisma in auth.ts since this is only exposed to middleware where edges checks for its compactibitliy
// middlware uses auth.config.ts for next-auth
