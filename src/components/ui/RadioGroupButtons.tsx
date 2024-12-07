import React, { createContext, useContext, useState } from "react"
import { CircleCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface RadioGroupContextType {
  value: string
  onChange: (_value: string) => void
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
  onChange?: (_value: string) => void
}) {
  const [value, setValue] = useState(defaultValue || "")

  const handleChange = (newValue: string) => {
    setValue(newValue)
    onChange?.(newValue)
  }

  return (
    <RadioGroupContext.Provider value={{ value, onChange: handleChange }}>
      <div role="radiogroup" className="flex gap-4 items-stretch">
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
        "relative flex flex-1 cursor-pointer rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
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
      <div className="flex flex-col gap-1">{children}</div>
      <div className="flex items-start w-8">
        {isChecked && <CircleCheck className="h-5 w-5 text-primary" />}
      </div>
    </label>
  )
}

export function RadioGroupButtonTitle({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="mb-2 text-lg font-semibold">{children}</div>
}

export function RadioGroupButtonDescription({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <span className="text-sm text-muted-foreground text-dark-blue font-medium">
      {children}
    </span>
  )
}
