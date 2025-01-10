import { auth } from "@/auth"

// accessing from server auth
export async function currentUser() {
  const session = await auth()
  return session?.user
}
