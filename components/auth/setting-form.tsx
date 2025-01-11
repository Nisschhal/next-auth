"use client"

import { settings } from "@/actions/settings"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

import { Input } from "@/components/ui/input"
import { useCurrentUser } from "@/hooks/use-current-user"
import { SettingSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import React, { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { UserRoles } from "@prisma/client"
import { useRouter } from "next/router"

export default function SettingForm() {
  const router = useRouter()

  useEffect(() => {
    router.reload()
  }, [])

  const user = useCurrentUser()
  const { update } = useSession()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      password: undefined,
      newPassword: undefined,
      role: user?.role,
      isTwoFactorEnabled: user?.isTwoFactorEnabled,
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
              {/* Name */}
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
                        placeholder="nisal dev"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* hide for oAuth users as email and password is not required for them */}
              {user?.isOAuth === false ? (
                <>
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

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            disabled={isPending}
                            placeholder="*******"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* New Password */}
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            disabled={isPending}
                            placeholder="*******"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : null}
              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRoles.ADMIN}>Admin</SelectItem>
                        <SelectItem value={UserRoles.USER}>User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Two Factor */}
              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Two Factor Authentication</FormLabel>
                      <FormDescription>
                        Enable two factor authentication for your account
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
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

;<Switch />
