import { Card, CardHeader } from "@/components/ui/card"
import { UserInfo } from "@/components/user-info"
import { currentUser } from "@/lib/auth"

export default async function ServerRoute() {
  const user = await currentUser()
  return <UserInfo label="💻 Server Component" user={user} />
}
