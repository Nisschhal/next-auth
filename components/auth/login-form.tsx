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

export function LoginForm() {
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
  const onSubmi = (values: LoginSchemaType) => {
    console.log(values)
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
        <form onSubmit={form.handleSubmit(() => {})}>
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
                    <Input {...field} placeholder="nischal.dev@example.com" />
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
                    <Input {...field} type="password" placeholder="********" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Error */}

            <FormError message="" />
            <FormSuccess message="" />
            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  )
}
