"use client"

import { settings } from "@/actions/settings"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCurrentUser } from "@/hooks/use-current-user"
import { SettingSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import React, { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

export default function Setting() {
  const user = useCurrentUser()
  const { update } = useSession()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [isPending, startTransition] = useTransition()
  const [showTwoFactor, setShowTwoFactor] = useState(false)

  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      name: user?.name!,
      email: user?.email,
    },
  })

  const onSubmit = (values: z.infer<typeof SettingSchema>) => {
    setSuccess("")
    setError("")
    startTransition(async () => {
      const { success, error } = await settings(values)
      if (success) {
        update()
        setSuccess(success)
      }
      if (error) setError(error)
    })
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-medium text-center">⚙️ Settings</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
            <div className="space-y-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="nisal dev"
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
              Update
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
