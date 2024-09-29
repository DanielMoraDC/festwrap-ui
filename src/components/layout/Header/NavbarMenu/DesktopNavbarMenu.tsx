"use client"
import { signIn, useSession } from "next-auth/react"
import Button from "@/components/ui/Button"
import NavLink from "@/components/layout/Header/NavbarMenu/NavLink"
import UserMenu from "@/components/layout/Header/NavbarMenu/UserMenu"

const DesktopNavbarMenu = () => {
  const { data: session } = useSession()

  return (
    <nav className="hidden md:flex gap-10 items-center">
      <NavLink href="/get-started">Get started</NavLink>
      <NavLink href="/how-it-works">How does it works?</NavLink>
      <NavLink href="/about-us">About us</NavLink>
      {session ? (
        <UserMenu session={session} />
      ) : (
        <Button
          variant="primary"
          onClick={() => signIn("spotify", { callbackUrl: "/" })}
        >
          Login with Spotify
        </Button>
      )}
    </nav>
  )
}

export default DesktopNavbarMenu
