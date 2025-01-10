"use client"

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Backbutton } from "./back-button"
import { Header } from "./header"
import { Social } from "./social"

// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  backButtonLabel: string
  backButtonHref: string
  showSocials?: boolean
}

function CardWrapper({
  children,
  headerLabel,
  backButtonHref,
  backButtonLabel,
  showSocials,
}: CardWrapperProps) {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>

      <CardContent>{children}</CardContent>
      {showSocials && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <Backbutton label={backButtonLabel} href={backButtonHref}></Backbutton>
      </CardFooter>
    </Card>
  )
}

export default CardWrapper
