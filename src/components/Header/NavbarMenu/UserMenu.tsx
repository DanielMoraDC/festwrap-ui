import * as Avatar from "@radix-ui/react-avatar"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import Button from "@/components/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserMenuProps = {
  session: Session
}

const dropdownMenuItemClasses =
  "group text-sm text-dark font-medium hover:bg-secondary hover:bg-opacity-50 flex items-center px-4 py-2 rounded-md cursor-pointer outline-none focus:bg-secondary focus:bg-opacity-50"

const UserMenu = ({ session }: UserMenuProps) => {
  const getInitialsFromName = (name: string) => {
    const [firstName, lastName] = name.split(" ")
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }

  const copyToClipboardToken = () => {
    navigator.clipboard.writeText(session?.user?.accessToken || "")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {getInitialsFromName(session.user.name || "")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={copyToClipboardToken}>
            Copy access token
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
