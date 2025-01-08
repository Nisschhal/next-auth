import { db } from "@/lib/db"

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    })
    return user
  } catch (error) {
    console.log("Error while getting user via email!")
    return null
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    })
    return user
  } catch (error) {
    console.log("Error while getting user via email!")
    return null
  }
}

export const getUserByIdWithoutPassword = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        password: false, // This excludes the password
      },
    })
    return user
  } catch (error) {
    console.error("Error while getting user by ID!", error)
    return null
  }
}
