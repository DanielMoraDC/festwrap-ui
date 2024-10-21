import { signIn, useSession } from "next-auth/react"
import UserMenu from "./UserMenu"
import Button from "@/components/ui/Button"
import Skeleton from "@/components/ui/Skeleton"
import useTranslation from "next-translate/useTranslation"
import { usePathname } from "next/navigation"

type SpotifyAuthDropdownProps = {
  isMobileScreen?: boolean
}

const SpotifyAuthDropdown = ({ isMobileScreen }: SpotifyAuthDropdownProps) => {
  const { t, lang } = useTranslation("common")
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const isSessionLoading = status === "loading"

  if (isSessionLoading) {
    return <Skeleton width="w-10" height="h-10" />
  }

  const handleSignIn = () => {
    const callbackUrl = `/${lang}${pathname}`
    signIn("spotify", { callbackUrl })
  }

  if (!session) {
    return (
      <Button variant="primary" onClick={handleSignIn}>
        {t("nav.login")}
      </Button>
    )
  }

  return <UserMenu session={session} isMobileScreen={isMobileScreen} />
}

export default SpotifyAuthDropdown
