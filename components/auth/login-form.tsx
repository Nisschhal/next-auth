"use client"

import React, { useState, useTransition } from "react"
import CardWrapper from "./card-wrapper"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { LoginSchema, LoginSchemaType } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormError } from "./form-error"
import { FormSuccess } from "./form-success"
import { login } from "@/actions/login"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : ""

  const callbackUrl = searchParams.get("callbackUrl")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [isPending, startTransition] = useTransition()
  const [showTwoFactor, setShowTwoFactor] = useState(false)

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setSuccess("")
    setError("")
    startTransition(async () => {
      const { success, error, twoFactor } = await login(values, callbackUrl)
      if (success) setSuccess(success)
      if (error) setError(error)
      if (twoFactor) setShowTwoFactor(true)
      //   login(values)
      //     .then(({ success, error }) => {
      //       if (success) setSuccess(success)
      //       if (error) setError(error)
      //     })
      //     .catch((error) => setError("Couldn't get action!"))
    })
  }

  return (
    <CardWrapper
      headerLabel={"Welcome back!"}
      backButtonLabel={"Don't have an account?"}
      backButtonHref={"/auth/register"}
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
          <div className="space-y-4">
            {/* Two Factor Code */}
            {/* Two Factor  */}
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123456"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!showTwoFactor && (
              <>
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          type="email"
                          placeholder="nisal.dev@example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Password */}
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="********"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Link
                    className="text-xs mt-1 hover:underline text-muted-foreground hover:text-foreground"
                    href={"/auth/reset"}
                  >
                    Forgot password?
                  </Link>
                </div>
              </>
            )}
          </div>

          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
