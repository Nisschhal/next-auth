import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { revalidatePath } from "next/cache"
import React from "react"

export default async function Setting() {
  const session = await auth()
  return (
    <>
      <p>{JSON.stringify(session)}</p>
      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/auth/login" })
        }}
      >
        <Button> Hey</Button>
      </form>
    </>
  )
}
