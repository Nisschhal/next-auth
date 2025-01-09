import { auth, signOut } from "@/auth"
import { revalidatePath } from "next/cache"
import React from "react"

export default async function SettingRoute() {
  const session = await auth()
  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server"
          await signOut()
          revalidatePath("/")
        }}
      >
        <button type="submit">Signout</button>
      </form>
    </div>
  )
}
