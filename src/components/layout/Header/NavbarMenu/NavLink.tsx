import Link from "next/link"
import { twMerge } from "tailwind-merge"

export type NavLinkVariant = "mobile" | "desktop"

type NavLinkProps = {
  href: string
  children: React.ReactNode
  variant?: NavLinkVariant
  onClick?: () => void
}

const baseClasses = "transition-all ease-in-out duration-200 font-medium"

const variantClasses: Record<NavLinkVariant, string> = {
  desktop: "text-primary hover:text-light",
  mobile: "text-dark hover:text-primary text-xl",
}

const NavLink = ({
  href,
  children,
  variant = "desktop",
  onClick,
}: NavLinkProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      role="link"
      className={twMerge(baseClasses, variantClasses[variant])}
    >
      {children}
    </Link>
  )
}

export default NavLink
