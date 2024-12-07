import NavLink from "@components/layout/Header/NavbarMenu/NavLink"
import SpotifyAuthDropdown from "./SpotifyAuthDropdown"
import useTranslation from "next-translate/useTranslation"

const DesktopNavbarMenu = () => {
  const { t } = useTranslation("common")
  return (
    <nav className="hidden md:flex gap-10 items-center">
      <NavLink href="/generate">{t("nav.getStarted")}</NavLink>
      <NavLink href="/about-us">{t("nav.aboutUs")}</NavLink>
      <SpotifyAuthDropdown />
    </nav>
  )
}

export default DesktopNavbarMenu
