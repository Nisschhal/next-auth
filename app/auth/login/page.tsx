"use client"
import LoginForm from "@/components/auth/login-form"
import { usePathname } from "next/navigation"
import React from "react"

export default function LoginRoute() {
  const pathname = usePathname()
  console.log({ pathname })
  return <LoginForm />
}
