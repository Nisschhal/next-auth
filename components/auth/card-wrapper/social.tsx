"use client"

import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { signIn } from "next-auth/react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"

export function Social() {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      redirectTo: "/settings",
    })
  }
  return (
    <div className="w-full flex items-center gap-x-2">
      <Button
        className="w-full"
        variant={"outline"}
        onClick={() => onClick("google")}
      >
        <FcGoogle />
      </Button>
      <Button
        className="w-full"
        variant={"outline"}
        onClick={() => onClick("github")}
      >
        <FaGithub />
      </Button>
    </div>
  )
}
