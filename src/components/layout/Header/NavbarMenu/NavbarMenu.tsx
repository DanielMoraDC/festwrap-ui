import { Link } from "lucide-react"
import MobileNavbarMenu from "./MobileNavbarMenu"
import DesktopNavbarMenu from "./DesktopNavbarMenu"

const NavbarMenu = () => {
  return (
    <>
      <MobileNavbarMenu />
      <DesktopNavbarMenu />
    </>
  )
}

export default NavbarMenu
