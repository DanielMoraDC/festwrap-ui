import NavLink from "@/components/layout/Header/NavbarMenu/NavLink"
import Button from "@/components/ui/Button"
import { signIn, useSession } from "next-auth/react"
import UserMenu from "./UserMenu"

const DesktopNavbarMenu = () => {
  const { data: session } = useSession()
  return (
    <nav className="hidden md:flex gap-10 items-center">
      <NavLink href="/get-started">Get started</NavLink>
      <NavLink href="/how-it-works">How it works?</NavLink>
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
