"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Check } from "lucide-react"

type StepperContextType = {
  currentStep: number
  handleChangeStep: (_step: number) => void
  stepsCount: number
}

const StepperContext = createContext<StepperContextType | undefined>(undefined)

export const useStepper = () => {
  const context = useContext(StepperContext)
  if (!context) throw new Error("useStepper must be used within a Stepper")
  return context
}

type StepperProps = {
  children: React.ReactNode
  currentStep?: number
  defaultStep?: number
  onStepChange?: (_step: number) => void
  stepsCount: number
}

export function Stepper({
  children,
  defaultStep = 1,
  currentStep = 1,
  stepsCount = 0,
  onStepChange,
}: StepperProps) {
  const [internalCurrentStep, setInternalCurrentStep] = useState(defaultStep)

  const handleChangeStep = (step: number) => {
    setInternalCurrentStep(step)
    onStepChange?.(step)
  }

  useEffect(() => {
    setInternalCurrentStep(currentStep)
  }, [currentStep])

  return (
    <StepperContext.Provider
      value={{ currentStep: internalCurrentStep, handleChangeStep, stepsCount }}
    >
      <div className="flex w-full flex-col md:flex-row">{children}</div>
    </StepperContext.Provider>
  )
}

export function StepList({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[400px] pt-0 sm:pt-20 flex flex-col gap-4">
      {children}
    </div>
  )
}

export function Step({
  stepNumber,
  title,
  description,
}: {
  stepNumber: number
  title: string
  description: string
}) {
  const { currentStep, handleChangeStep, stepsCount } = useStepper()

  const isCompleted = stepNumber < currentStep
  const isCurrent = stepNumber === currentStep
  const isDisabled = stepNumber > currentStep

  return (
    <div className="relative">
      <button
        onClick={() => !isDisabled && handleChangeStep(stepNumber)}
        className={`relative z-10 flex items-start gap-4 w-full p-4 hover:bg-accent rounded-lg transition-colors ${
          isCurrent ? "bg-accent" : ""
        } ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        disabled={isDisabled}
        aria-current={isCurrent ? "step" : undefined}
      >
        <div className="flex items-center justify-center w-9 h-9 rounded text-lg font-medium bg-secondary text-primary-foreground">
          {isCompleted ? <Check size={20} /> : stepNumber}
        </div>
        <div className="flex-1 text-left">
          <div className="font-semibold">{title}</div>
          <div className="text-sm font-medium text-muted-foreground text-dark-blue">
            {description}
          </div>
        </div>
      </button>
      {stepNumber < stepsCount && (
        <div className="absolute left-7 top-[3.25rem] bottom-0 w-px bg-border ml-0.5" />
      )}
    </div>
  )
}

export function StepContent({
  stepNumber,
  children,
}: {
  stepNumber: number
  children: React.ReactNode
}) {
  const { currentStep } = useStepper()

  if (stepNumber !== currentStep) return null

  return <div className="space-y-6">{children}</div>
}
