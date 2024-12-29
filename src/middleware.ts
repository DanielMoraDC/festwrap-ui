import { NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"

export default withAuth(function middleware() {
  return NextResponse.next()
})

export const config = {
  matcher: "/generate",
}
