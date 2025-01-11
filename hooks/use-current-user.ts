"use client"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

export const useCurrentUser = () => {
  const { data: session, status, update } = useSession()

  // Optionally refresh session data on component mount
  useEffect(() => {
    if (status === "authenticated") {
      update()
    }
  }, [status, update])

  return session?.user
}
