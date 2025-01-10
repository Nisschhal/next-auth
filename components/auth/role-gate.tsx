import { useCurrentUser } from "@/hooks/use-current-user"
import { UserRoles } from "@prisma/client"

interface RoleGateProps {
  children: React.ReactNode
  allowedRole: UserRoles
}

import React from "react"
import { FormError } from "./form-error"

export function RoleGate({ children, allowedRole }: RoleGateProps) {
  const user = useCurrentUser()
  if (user?.role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content! 🥹" />
    )
  }
  return <>{children}</>
}
