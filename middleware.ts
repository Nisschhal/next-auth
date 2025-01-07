import authConfig from "./auth.config"
import NextAuth from "next-auth"

const { auth } = NextAuth(authConfig)

// invoke this function whenever routes matches to given regex
export default auth((req) => {
  console.log("auth", req.auth)
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
