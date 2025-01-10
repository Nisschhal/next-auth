"use client"
import { UserInfo } from "@/components/user-info"
import { useCurrentUser } from "@/hooks/use-current-user"

export default function ClientRoute() {
  const user = useCurrentUser()
  return <UserInfo label="🧑‍💻 Client Component" user={user} />
}
