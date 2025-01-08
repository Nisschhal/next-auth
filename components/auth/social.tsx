"use client"

import { FcGoogle } from "react-icons/fc"
import { Button } from "../ui/button"
import { FaGithub } from "react-icons/fa"
import { signIn } from "next-auth/react"
import { useState, useTransition } from "react"

export function Social() {
  const [isLoading, setIsLoading] = useState(false)
  const onClick = (provider: "google" | "github") => {
    setIsLoading(true)
    signIn(provider, {
      redirectTo: "/settings",
    })
    setIsLoading(false)
  }
  return (
    <div className="w-full flex items-center gap-x-2">
      <Button
        disabled={isLoading}
        className="w-full"
        variant={"outline"}
        onClick={() => onClick("google")}
      >
        <FcGoogle />
      </Button>
      <Button
        disabled={isLoading}
        className="w-full"
        variant={"outline"}
        onClick={() => onClick("github")}
      >
        <FaGithub />
      </Button>
    </div>
  )
}
