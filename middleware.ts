import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()
/**
 * 
 * By default, clerkMiddleware() will not protect any routes. 
 * All routes are public and you must opt-in to protection for routes. 
 * See the clerkMiddleware() reference to learn how to require authentication for specific routes.
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}