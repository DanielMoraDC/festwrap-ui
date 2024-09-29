import { Link } from "lucide-react"
import MobileNavbarMenu from "./MobileNavbarMenu"
import DesktopNavbarMenu from "./DesktopNavbarMenu"
import { signIn, useSession } from "next-auth/react"
import Button from "@/components/ui/Button"
import UserMenu from "./UserMenu"

const NavbarMenu = () => {
  const { data: session } = useSession()

  return (
    <div className="flex items-center justify-end gap-3 sm:gap-6">
      <MobileNavbarMenu />
      <DesktopNavbarMenu />
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
    </div>
  )
}

export default NavbarMenu
