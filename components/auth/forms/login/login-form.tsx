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

import { LoginSchema, LoginSchemaType } from "@/schemas"
import { LoginAction } from "@/actions/login"
import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import CardWrapper from "../../card-wrapper/card-wrapper"
import { Input } from "@/components/ui/input"
import { FormSuccess } from "../form-success"
import { FormError } from "../form-error"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  // if error of linked account
  const searchParams = useSearchParams()
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : ""

  // to perform server actions
  const [isPending, startTransition] = useTransition()
  // two factor state
  const [showTwoFactor, setShowTwoFactor] = useState<boolean | undefined>(false)
  // error and success state
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  // infer form type using loginSchema and automatically check default value props
  // resolver validates form fields using given schema
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  })

  // form submit handler
  // gets the validated values form the form
  const onSubmit = (values: LoginSchemaType) => {
    // Reset the error and success state
    setError("")
    setSuccess("")
    // setShowTwoFactor(false)

    startTransition(async () => {
      const result = await LoginAction(values)

      // Fallback in case `result` is undefined or invalid
      if (!result) {
        setError("Unexpected error, please try again!")
        return
      }

      const { error, success, showTwoFactor } = result // Safely destructure
      console.log(error, success, showTwoFactor)

      if (error) {
        setError(error)
      }
      if (success) {
        setSuccess(success)
      }
      if (showTwoFactor) {
        setShowTwoFactor(showTwoFactor)
      }
      // console.error("Error while login form:", err)
      // setError("Something went wrong, please try again, or reload! 😉")
    })
  }

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/signup"
      showSocial
    >
      <Form {...form}>
        {/* // create a html form */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
                    href={"/auth/reset"}
                    className="text-xs hover:underline text-muted-foreground"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </>
            )}

            {/* Form Error */}

            <FormSuccess message={success} />
            <FormError message={error || urlError} />
            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {showTwoFactor ? "Verify" : "Login"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  )
}
