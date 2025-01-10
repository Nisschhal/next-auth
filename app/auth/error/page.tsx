import CardWrapper from "@/components/auth/card-wrapper"
import React from "react"
import { FaExclamation } from "react-icons/fa"
import { HiOutlineExclamationTriangle } from "react-icons/hi2"

export default function ErrorCard() {
  return (
    <CardWrapper
      headerLabel={"Oops!, something went wrong, try again!😬"}
      backButtonLabel={"Go to login"}
      backButtonHref={"/auth/login"}
    >
      <div className="flex items-center justify-center">
        <HiOutlineExclamationTriangle className="w-5 h-5  text-destructive" />
      </div>
    </CardWrapper>
  )
}
