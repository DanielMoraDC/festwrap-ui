import * as Avatar from "@radix-ui/react-avatar"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import Button from "@/components/Button"

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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">
          {getInitialsFromName(session.user.name || "")}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-white rounded-md border border-secondary border-opacity-50 shadow-lg p-1 mt-1"
          sideOffset={5}
          align="end"
        >
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-dark">{session.user.name}</p>
            <p className="text-xs text-light">{session.user.email}</p>
          </div>

          <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
          <DropdownMenu.Item
            onClick={copyToClipboardToken}
            className={dropdownMenuItemClasses}
          >
            Copy access token
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => signOut()}
            className={dropdownMenuItemClasses}
          >
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default UserMenu
