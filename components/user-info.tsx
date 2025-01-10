import { ExtendedUser } from "@/auth-next"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Badge } from "./ui/badge"

interface UserProps {
  user?: ExtendedUser
  label: string
}

export function UserInfo({ user, label }: UserProps) {
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ID */}
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">ID</p>
          <p className="text-xs font-mono max-w-[180px] bg-slate-100 rounded-md p-1 truncate">
            {user?.id}
          </p>
        </div>
        {/* Name */}
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Name</p>
          <p className="text-xs font-mono max-w-[180px] bg-slate-100 rounded-md p-1 truncate">
            {user?.name}
          </p>
        </div>
        {/* Email */}
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Email</p>
          <p className="text-xs font-mono max-w-[180px] bg-slate-100 rounded-md p-1 truncate">
            {user?.email}
          </p>
        </div>
        {/* Name */}
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Role</p>
          <p className="text-xs font-mono max-w-[180px] bg-slate-100 rounded-md p-1 truncate">
            {user?.role}
          </p>
        </div>
        {/* Two Factor Auth */}
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Two Factor Authentication</p>
          <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
