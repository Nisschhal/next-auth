import {} from "uuid"
import { db } from "./db"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"

/**
 * Generates Two factor confrimation and save to database
 * @param userId - Email to verify token
 * @returns - returns generate two factor Confirmation Object including: `userId`
 */
export const generateTwoFactorConfirmation = async (userId: string) => {
  try {
    await db.twoFactorConfirmation.delete({ where: { userId } })

    const twoFactorConfirmation = await db.twoFactorConfirmation.create({
      data: {
        userId: userId,
      },
    })

    return twoFactorConfirmation
  } catch (error) {
    console.log("Error while generating two factor confirmation", error)
  }
}
/**
 * Delete Two factor confrimation
 * @param userId - Email to verify confirmation
 * @returns - returns generate two factor Confirmation Object including: `userId`
 */
export const deleteTwoFactorConfirmation = async (userId: string) => {
  try {
    await db.twoFactorConfirmation.delete({ where: { userId } })
  } catch (error) {
    console.log("Error while deleting two factor confirmation", error)
  }
}
