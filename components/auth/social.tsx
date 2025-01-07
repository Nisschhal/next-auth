"use client"

import { FcGoogle } from "react-icons/fc"
import { Button } from "../ui/button"
import { FaGithub } from "react-icons/fa"

export function Social() {
  return (
    <div className="w-full flex items-center gap-x-2">
      <Button className="w-full" variant={"outline"} onClick={() => {}}>
        <FcGoogle />
      </Button>
      <Button className="w-full" variant={"outline"} onClick={() => {}}>
        <FaGithub />
      </Button>
    </div>
  )
}
