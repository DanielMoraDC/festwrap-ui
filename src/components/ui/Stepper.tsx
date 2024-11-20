"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import Button from "./Button"

type StepperContextType = {
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  stepsCount: number
}

const StepperContext = createContext<StepperContextType | undefined>(undefined)

export function Stepper({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [stepsCount, setStepsCount] = useState(0)

  useEffect(() => {
    setStepsCount(React.Children.count(children))
  }, [children])

  return (
    <StepperContext.Provider
      value={{ currentStep, setCurrentStep, stepsCount }}
    >
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-[300px_1fr] gap-6">{children}</div>
      </div>
    </StepperContext.Provider>
  )
}

export function StepList({ children }: { children: React.ReactNode }) {
  return <div className="relative">{children}</div>
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
  const context = useContext(StepperContext)
  if (!context) throw new Error("Step must be used within a Stepper")
  const { currentStep, setCurrentStep, stepsCount } = context

  const isCompleted = stepNumber < currentStep
  const isCurrent = stepNumber === currentStep
  const isDisabled = stepNumber > currentStep

  return (
    <div className="relative">
      <button
        onClick={() => !isDisabled && setCurrentStep(stepNumber)}
        className={`relative z-10 flex items-start gap-4 w-full p-4 hover:bg-accent rounded-lg transition-colors ${
          isCurrent ? "bg-accent" : ""
        } ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        disabled={isDisabled}
        aria-current={isCurrent ? "step" : undefined}
      >
        <div
          className={`flex items-center justify-center w-9 h-9 rounded text-lg font-medium ${
            isCurrent
              ? "bg-secondary text-primary-foreground"
              : isCompleted
                ? "bg-primary/50 text-primary-foreground"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {stepNumber}
        </div>
        <div className="flex-1 text-left">
          <div className="font-medium">{title}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
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
  const context = useContext(StepperContext)
  if (!context) throw new Error("StepContent must be used within a Stepper")
  const { currentStep } = context

  if (stepNumber !== currentStep) return null

  return <div className="space-y-6">{children}</div>
}

export function StepperNavigation() {
  const context = useContext(StepperContext)
  if (!context)
    throw new Error("StepperNavigation must be used within a Stepper")
  const { currentStep, setCurrentStep, stepsCount } = context

  const handleNext = () => {
    if (currentStep < stepsCount) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" && currentStep < stepsCount) {
      handleNext()
    } else if (e.key === "ArrowLeft" && currentStep > 1) {
      handleBack()
    }
  }

  return (
    <div className="flex justify-between mt-8">
      {currentStep > 1 && (
        <Button onClick={handleBack} onKeyDown={handleKeyDown}>
          Back
        </Button>
      )}
      <div className="flex-1" />
      <Button onClick={handleNext} onKeyDown={handleKeyDown}>
        {currentStep === stepsCount ? "Complete" : "Continue"}
      </Button>
    </div>
  )
}

export function useStepperContext() {
  const context = useContext(StepperContext)
  if (!context)
    throw new Error("useStepperContext must be used within a Stepper")
  return context
}