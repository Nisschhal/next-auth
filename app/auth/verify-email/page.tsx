"use client"

import VerifyEmailAction from "@/actions/verify-email"
import CardWrapper from "@/components/auth/card-wrapper"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"

export default function VerifyEmail() {
  // error and success state
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [isLoading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  console.log(token, "got token here clidn ")

  const verify = async () => {
    setError("")
    setSuccess("")
    setLoading(true)
    if (token) {
      const { success, error } = await VerifyEmailAction(token)
      if (success) setSuccess(success)
      if (error) setError(error)
    } else {
      setError("Token is missing!")
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!token) return
    verify()
  }, [token])

  return (
    <CardWrapper
      headerLabel={"Verifying Token..."}
      backButtonLabel={"Back to login"}
      backButtonHref={"/auth/login"}
    >
      <div>
        {isLoading ? (
          <div className="flex justify-center gap-x-2">
            <span
              className="w-5 h-5 border-2 border-blue-500
                        border-t-transparent rounded-full 
                        animate-spin"
            />
            Confirming your email!
          </div>
        ) : (
          <>
            <FormError message={error} />
            <FormSuccess message={success} />
          </>
        )}
      </div>
    </CardWrapper>
  )
}
