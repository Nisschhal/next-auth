import authConfig from "./auth.config"
import NextAuth from "next-auth"

// Routes for different cases: public | protected
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes"

const { auth } = NextAuth(authConfig)

// invoke this function whenever routes matches to given regex
export default auth((req) => {
  const { nextUrl } = req

  const isLoggedIn = !!req.auth

  // set differnt routes according to different usecases

  // 1. Next Auth api routes "/api/auth/[...]"
  //  - if request hits this routes do nothing
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  // 2. NextJs authentication routes: '/login' | '/signup'
  // - if logged in redirect to '/settings'
  // - if not, do nothing
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  // 3. Public routes such as homepage: '/'
  // - last route to hit as no above routes are fired so do nothing
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

  // 1
  if (isApiAuthRoute) {
    return
  }

  // 2.
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return
  }

  // 4. is not logged In and is not on a public routes then redirect to '/auth/login'
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl))
  }

  // 4. for other routes that don't meet aboves requirement do nothing as well
  return
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
