"use client"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  NewPasswordSchema,
  NewPasswordSchemaType,
  ResetSchema,
  ResetSchemaType,
} from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "next/navigation"
import CardWrapper from "./card-wrapper"
import { FormError } from "./form-error"
import { FormSuccess } from "./form-success"
import { changePassword } from "@/actions/new-password"

export default function NewPasswordForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const searchParams = useSearchParams()

  const token = searchParams.get("token")

  // Create form
  const form = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      password1: "",
    },
  })

  // handle submit
  const onSubmit = (values: NewPasswordSchemaType) => {
    setError("")
    setSuccess("")
    startTransition(async () => {
      const result = await changePassword(values, token!)

      // Fallback in case `result` is undefined or invalid
      if (!result) {
        setError("Unexpected error, please try again!")
        return
      }

      const { error, success } = result // Safely destructure
      console.log(error, success)

      if (error) {
        setError(error)
      }
      if (success) {
        setSuccess(success)
      }
      // console.error("Error while login form:", err)
      // setError("Something went wrong, please try again, or reload! 😉")
    })
  }

  return (
    <CardWrapper
      headerLabel={"Forgot your password?"}
      backButtonLabel={"Back to login"}
      backButtonHref={"/auth/login"}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  {/* Spread ...field for controlled input */}
                  <Input
                    type="password"
                    disabled={isPending}
                    {...field}
                    placeholder="*******"
                    //   disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  {/* Spread ...field for controlled input */}
                  <Input
                    type="password1"
                    disabled={isPending}
                    {...field}
                    placeholder="*******"
                    //   disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit">
            Rest Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
