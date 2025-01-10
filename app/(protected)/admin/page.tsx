"use client"
import { admin } from "@/actions/admin"
import { FormSuccess } from "@/components/auth/form-success"
import { RoleGate } from "@/components/auth/role-gate"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useCurrentUser } from "@/hooks/use-current-user"
import { UserRoles } from "@prisma/client"
import React from "react"
import { toast } from "sonner"
export default function AdminRoute() {
  const user = useCurrentUser()

  const onApiRouteClick = async () => {
    // const res = await fetch("/api/admin")
    // if (res.ok) {
    //   toast.success("Allowed API Route! ")
    // } else {
    //   toast.error("Forbidden Route! ")
    // }

    const { error, success } = await admin()
    if (success) toast.success(success)
    if (error) toast.error(error)
  }
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl text-center font-semibold">🔑 Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRoles.ADMIN}>
          <FormSuccess message="You are allowed to see this content! 👏" />
        </RoleGate>
        <div className="flex items-center justify-between rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>
        <div className="flex items-center justify-between rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  )
}
