"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type StepperContextType = {
  currentStep: number
  handleChangeStep: (_step: number) => void
  stepsCount: number
  isCompletedForm?: boolean
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
  isCompleted?: boolean
}

export function Stepper({
  children,
  defaultStep = 1,
  currentStep = 1,
  stepsCount = 0,
  onStepChange,
  isCompleted,
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
      value={{
        currentStep: internalCurrentStep,
        handleChangeStep,
        stepsCount,
        isCompletedForm: isCompleted,
      }}
    >
      <div className="flex w-full gap-2 flex-col md:flex-row">{children}</div>
    </StepperContext.Provider>
  )
}

export function StepList({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[400px] pt-0 sm:pt-20 flex flex-col">
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
  const { currentStep, handleChangeStep, stepsCount, isCompletedForm } =
    useStepper()

  const isCompleted = stepNumber < currentStep
  const isCurrent = stepNumber === currentStep
  const isDisabled = stepNumber > currentStep

  return (
    <div className="relative">
      <button
        onClick={() => !isDisabled && handleChangeStep(stepNumber)}
        className={`relative z-10 flex items-start gap-4 w-full px-4 pt-2 pb-8 hover:bg-accent rounded-lg transition-colors ${
          isCurrent ? "bg-accent" : ""
        } ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        disabled={isDisabled || isCompletedForm}
        aria-current={isCurrent ? "step" : undefined}
      >
        <div
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-full text-lg font-medium text-primary-foreground",
            isCompleted
              ? "bg-primary text-white"
              : isCurrent
                ? "border-2 border-primary"
                : "bg-secondary"
          )}
        >
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
        <div
          className={cn(
            "absolute left-8 top-12 w-0.5 h-[calc(100%-2.8rem)]",
            isCompleted ? "bg-primary" : "bg-secondary"
          )}
        />
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

  return (
    <div className="space-y-6" role="tabpanel">
      {children}
    </div>
  )
}
