import { auth } from "@/auth"

// invoke this function whenever routes matches to given regex
export default auth((req) => {
  console.log(req.cookies)
  console.log(req.nextUrl.pathname)
})

// match the following routes to invoke above auth()
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
