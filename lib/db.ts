// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}
// const globalForPrisma = global as unknown as { prisma: PrismaClient }

// export const db = globalForPrisma.prisma || new PrismaClient()
export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma = db
