import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db as prisma } from "@/lib/db"
import authConfig from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})
