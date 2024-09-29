import LogoLink from "./LogoLink"
import NavbarMenu from "@/components/Header/NavbarMenu/NavbarMenu"

const Header = () => {
  return (
    <header className="text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-8">
          <div className="flex justify-start">
            <LogoLink />
          </div>
          <NavbarMenu />
        </div>
      </div>
    </header>
  )
}

export default Header
