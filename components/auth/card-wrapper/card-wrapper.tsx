"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Backbutton } from "./back-button"
import { Social } from "./social"
import { Header } from "./header"

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  backButtonLabel: string
  backButtonHref: string
  showSocial?: boolean
}

function CardWrapper({
  children,
  headerLabel,
  backButtonHref,
  backButtonLabel,
  showSocial,
}: CardWrapperProps) {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
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
