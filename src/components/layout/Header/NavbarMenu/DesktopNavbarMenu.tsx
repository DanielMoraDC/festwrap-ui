import NavLink from "@/components/layout/Header/NavbarMenu/NavLink"

const DesktopNavbarMenu = () => {
  return (
    <nav className="hidden md:flex gap-10 items-center">
      <NavLink href="/get-started">Get started</NavLink>
      <NavLink href="/how-it-works">How does it works?</NavLink>
      <NavLink href="/about-us">About us</NavLink>
    </nav>
  )
}

export default DesktopNavbarMenu
