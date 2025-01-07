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
import {
  LoginSchema,
  LoginSchemaType,
  SignupSchema,
  SignupSchemaType,
} from "@/schemas"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { LoginAction } from "@/actions/login"
import { useState, useTransition } from "react"
import { SignupAction } from "@/actions/signup"

export function SignupForm() {
  // to perform server actions
  const [isPending, startTransition] = useTransition()
  // error and success state
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  // infer form type using loginSchema and automatically check default value props
  // resolver validates form fields using given schema
  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  // form submit handler
  // gets the validated values form the form
  const onSubmit = (values: SignupSchemaType) => {
    // reset the error || success state
    setError("")
    setSuccess("")

    // perform server action and reflect of isPending
    startTransition(async () => {
      const { success, error } = await SignupAction(values)
      if (error) setError(error)
      if (success) setSuccess(success)
    })
  }

  return (
    <CardWrapper
      headerLabel="Create an Account"
      backButtonLabel="Already have an accout?"
      backButtonHref="/auth/login"
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

            {/* Name Input */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Full Name"
                      disabled={isPending}
                      className="placeholder:text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Error */}

            <FormSuccess message={success} />
            <FormError message={error} />
            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isPending}>
              Sign up
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  )
}
