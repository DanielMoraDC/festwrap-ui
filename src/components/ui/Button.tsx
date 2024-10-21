import { cn } from "@/lib/utils"
import { forwardRef } from "react"

type ButtonVariant = "primary" | "secondary" | "ghost"

type ButtonProps<T extends React.ElementType> = {
  as?: T
  children: React.ReactNode
  variant?: ButtonVariant
  className?: string
  isIconOnly?: boolean
} & React.ComponentPropsWithoutRef<T>

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary hover:bg-opacity-90",
  secondary: "bg-secondary text-dark hover:bg-opacity-90",
  ghost: "hover:bg-gray-100 text-gray-800",
}

const paddingClasses: Record<string, string> = {
  onlyIcon: "p-2",
  iconWithText: "py-2 px-4",
}

const baseClasses =
  "rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark transition-colors duration-200"

// eslint-disable-next-line react/display-name
export const Button = forwardRef(
  <T extends React.ElementType = "button">(
    {
      as,
      children,
      variant = "primary",
      className = "",
      isIconOnly = false,
      ...props
    }: ButtonProps<T>,
    ref: React.ComponentPropsWithRef<T>["ref"]
  ) => {
    const Component = as || "button"
    const variantClass = variantClasses[variant]
    const paddingClass = isIconOnly
      ? paddingClasses.onlyIcon
      : paddingClasses.iconWithText

    return (
      <Component
        className={cn(baseClasses, variantClass, paddingClass, className)}
        ref={ref}
        {...(Component !== "button" ? { role: "button", tabIndex: 0 } : {})}
        {...props}
      >
        {children}
      </Component>
    )
  }
) as <T extends React.ElementType = "button">(
  _props: ButtonProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] }
) => React.ReactElement

export default Button
