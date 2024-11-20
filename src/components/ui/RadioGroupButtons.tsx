import React, { createContext, useContext, useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface RadioGroupContextType {
  value: string
  onChange: (value: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(
  undefined
)

export function RadioGroupButtons({
  children,
  defaultValue,
  onChange,
}: {
  children: React.ReactNode
  defaultValue?: string
  onChange?: (value: string) => void
}) {
  const [value, setValue] = useState(defaultValue || "")

  const handleChange = (newValue: string) => {
    setValue(newValue)
    onChange?.(newValue)
  }

  return (
    <RadioGroupContext.Provider value={{ value, onChange: handleChange }}>
      <div role="radiogroup" className="flex gap-4">
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

export function RadioGroupButton({
  value,
  children,
}: {
  value: string
  children: React.ReactNode
}) {
  const context = useContext(RadioGroupContext)
  if (!context)
    throw new Error("RadioGroupButton must be used within a RadioGroupButtons")

  const isChecked = context.value === value

  return (
    <label
      className={cn(
        "relative flex flex-1 h-full cursor-pointer flex-col rounded-lg border-2 border-muted bg-popover p-6 hover:bg-accent",
        isChecked && "border-primary"
      )}
    >
      <input
        type="radio"
        className="sr-only"
        value={value}
        checked={isChecked}
        onChange={() => context.onChange(value)}
      />
      {isChecked && (
        <Check className="absolute right-4 top-4 h-6 w-6 text-primary" />
      )}
      {children}
    </label>
  )
}

export function RadioGroupButtonTitle({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="mb-4 mt-2 text-2xl font-semibold">{children}</div>
}

export function RadioGroupButtonDescription({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <span className="text-base text-muted-foreground text-dark-blue font-medium">
      {children}
    </span>
  )
}