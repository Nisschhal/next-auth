import { db } from "@/lib/db"

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } })
    return user
  } catch (error) {
    console.log("Error while getting user by Email", error)
    return null
  }
}
export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } })
    return user
  } catch (error) {
    console.log("Error while getting user by Id", error)
    return null
  }
}

export const getAccountByUserId = async (userId: string) => {
  try {
    const accountUser = await db.account.findFirst({ where: { userId } })
    return accountUser
  } catch (error) {
    console.log("Error while getting account by userId", error)
    return null
  }
}
