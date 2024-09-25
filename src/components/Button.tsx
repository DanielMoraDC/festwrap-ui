import { forwardRef } from "react"
import { twMerge } from "tailwind-merge"

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps<T extends React.ElementType> = {
  as?: T
  children: React.ReactNode
  variant?: ButtonVariant
  className?: string
} & React.ComponentPropsWithoutRef<T>

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary hover:bg-opacity-90",
  secondary: "bg-secondary text-dark hover:bg-opacity-90",
  ghost: 'hover:bg-gray-100 text-gray-800'
}

const baseClasses = 'px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200'

export const Button = forwardRef(<T extends React.ElementType = 'button'>(
  { as, children, variant = 'primary', className = '', ...props }: ButtonProps<T>,
  ref: React.ComponentPropsWithRef<T>['ref']
) => {
  const Component = as || 'button'
  const variantClass = variantClasses[variant]

  return (
    <Component
      className={twMerge(baseClasses, variantClass, className)}
      ref={ref}
      {...(Component !== 'button' ? { role: 'button', tabIndex: 0 } : {})}
      {...props}
    >
      {children}
    </Component>
  )
}) as <T extends React.ElementType = 'button'>(
  props: ButtonProps<T> & { ref?: React.ComponentPropsWithRef<T>['ref'] }
) => React.ReactElement

export default Button
