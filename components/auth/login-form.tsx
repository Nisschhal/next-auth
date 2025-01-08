"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import CardWrapper from "./card-wrapper"
import { LoginSchema, LoginSchemaType } from "@/schemas"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { LoginAction } from "@/actions/login"
import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"

export function LoginForm() {
  // if error of linked account
  const searchParams = useSearchParams()
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : ""

  // to perform server actions
  const [isPending, startTransition] = useTransition()
  // error and success state
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  // infer form type using loginSchema and automatically check default value props
  // resolver validates form fields using given schema
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // form submit handler
  // gets the validated values form the form
  const onSubmit = (values: LoginSchemaType) => {
    // reset the error || success state
    setError("")
    setSuccess("")

    // perform server action and reflect of isPending
    startTransition(async () => {
      const { success, error } = await LoginAction(values)
      if (error) setError(error || "")
      if (success) setSuccess(success || "")
    })
  }

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an accout?"
      backButtonHref="/auth/signup"
      showSocial
    >
      <Form {...form}>
        {/* // create a html form */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email Input */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    {/* Spread ...field for controlled input */}
                    <Input
                      {...field}
                      placeholder="nischal.dev@example.com"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Input */}
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

            {/* Form Error */}

            <FormSuccess message={success} />
            <FormError message={error || urlError} />
            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isPending}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  )
}
