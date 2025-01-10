"use server"

import { currentRole } from "@/lib/auth"
import { UserRoles } from "@prisma/client"
import { error } from "console"

export const admin = async () => {
  const role = await currentRole()

  if (role === UserRoles.ADMIN) {
    return { success: "Allowed Server Action! 😊" }
  }
  return { error: "Forbidden Server Action! 😤" }
}
