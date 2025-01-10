"use client"

import { logout } from "@/actions/logout"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"
import { LogOutIcon } from "lucide-react"

export function LogoutButton() {
  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    await logout() // Call the server-side logout logic
  }

  return (
    <span
      className="flex  items-center gap-x-2 cursor-pointer"
      onClick={onClick}
    >
      <LogOutIcon className="w-4 h-4" /> Logout
    </span>
  )
}
