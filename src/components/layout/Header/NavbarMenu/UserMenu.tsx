import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import Button from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import useTranslation from "next-translate/useTranslation"

type UserMenuProps = {
  session: Session
  isMobileScreen?: boolean
}

const UserMenu = ({ session, isMobileScreen }: UserMenuProps) => {
  const { t } = useTranslation("common")

  const getInitialsFromName = (name: string) => {
    const nameSplitBySpaces = name.split(" ")
    return nameSplitBySpaces.map((n) => n[0]).join("")
  }

  const copyToClipboardToken = () => {
    navigator.clipboard.writeText(session?.user?.accessToken || "")
  }

  const dropdownOverlayAlignment = isMobileScreen ? "center" : "end"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" isIconOnly>
          {getInitialsFromName(session.user.name || "")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align={dropdownOverlayAlignment}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text font-medium leading-none">{session.user.name}</p>
            <p className="text-sm leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={copyToClipboardToken}>
            {t("nav.copyAccessToken")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            {t("nav.logout")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
