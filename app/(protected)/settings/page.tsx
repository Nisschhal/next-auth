"use client"

import { logout } from "@/actions/logout"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useSession } from "next-auth/react"
import React from "react"

export default function Setting() {
  const user = useCurrentUser()

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    await logout() // Call the server-side logout logic
  }

  return (
    <>
      <p>{JSON.stringify(user)}</p>
      <form>
        <Button onClick={onClick}>Logout</Button>
      </form>
    </>
  )
}
