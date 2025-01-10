"use client"

import React, { useState, useTransition } from "react"
import CardWrapper from "./card-wrapper"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { LoginSchema, LoginSchemaType, SignupSchema } from "@/schemas"
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
import { register } from "@/actions/register"

export default function RegisterForm() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  const onSubmit = (values: z.infer<typeof SignupSchema>) => {
    setSuccess("")
    setError("")
    startTransition(async () => {
      const { success, error } = await register(values)
      if (success) {
        setSuccess(success)
        form.reset()
      }
      if (error) setError(error)
      // register(values)
      //   .then(({ success, error }) => {
      //     if (success) setSuccess(success)
      //     if (error) setError(error)
      //   })
      //   .catch((error) => setError("Couldn't get action!"))
    })
  }

  return (
    <CardWrapper
      headerLabel={"Welcome back!"}
      backButtonLabel={"Go to login"}
      backButtonHref={"/auth/login"}
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
          <div className="space-y-4">
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
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="nischal puri"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
