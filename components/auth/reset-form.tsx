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
import { ResetSchema, ResetSchemaType } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import CardWrapper from "./card-wrapper"
import { FormError } from "./form-error"
import { FormSuccess } from "./form-success"
import { resetPassword } from "@/actions/reset"

export default function ResetForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const form = useForm<ResetSchemaType>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (values: ResetSchemaType) => {
    setError("")
    setSuccess("")
    startTransition(async () => {
      const result = await resetPassword(values)

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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  {/* Spread ...field for controlled input */}
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="nischal.dev@example.com"
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
