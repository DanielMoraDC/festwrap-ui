import Link from "next/link"
import { LanguageSelectorComponent } from "./LanguageSelector"
import useTranslation from "next-translate/useTranslation"

const Footer = () => {
  const { t } = useTranslation("common")
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary bg-opacity-30 text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-start items-start space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-x-6 sm:space-y-0 py-6">
          <LanguageSelectorComponent />
          <nav className="flex flex-col gap-2 items-start sm:flex-row sm:gap-10 sm:items-end font-medium text-sm">
            <Link href="/get-started">{t("nav.getStarted")}</Link>
            <Link href="/about-us">{t("nav.aboutUs")}</Link>
          </nav>
        </div>
        <div className="flex justify-start flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:space-x-6 text-sm border-t border-secondary py-4">
          <nav className="flex flex-col sm:flex-row gap-2 sm:gap-10">
            <Link href="/terms-of-service">{t("nav.termsOfService")}</Link>
            <Link href="/privacy-policy">{t("nav.privacyPolicy")}</Link>
          </nav>
          <p>
            &copy; {currentYear} Festwrap. {t("footer.allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
