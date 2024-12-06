import { z } from "zod"
import PlaylistGetUrlLink from "@components/generate/PlaylistGetUrlLink/PlaylistGetUrlLink"
import PlaylistSearchBandsForm from "@components/generate/PlaylistSearchBandsForm/PlaylistSearchBandsForm"
import PlaylistSetupForm from "@components/generate/PlaylistSetupForm/PlaylistSetupForm"
import { Button } from "@components/ui/Button"
import { Stepper, StepList, Step, StepContent } from "@components/ui/Stepper"
import useTranslation from "next-translate/useTranslation"
import Link from "next/link"
import { useState } from "react"

const STEPS_COUNT = 3
const formSchema = z
  .object({
    playlistType: z.enum(["new", "existing"]),
    name: z.string().optional(),
    playlistSelected: z.string().optional(),
    isPrivate: z.boolean(),
    bands: z.array(z.number().min(1)).nonempty("At least one band is required"),
  })
  .superRefine((data, ctx) => {
    if (data.playlistType === "new" && !data.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name is required for NEW role",
        path: ["name"],
      })
    }

    if (data.playlistType === "existing" && !data.playlistSelected) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Playlist is required for EXISTING role",
        path: ["playlistSelected"],
      })
    }
  })

const GeneratePlaylistStepper = () => {
  const { t } = useTranslation("generate")
  const [currentStep, setCurrentStep] = useState(1)

  const handleChangeStep = (step: number) => {
    setCurrentStep(step)
  }

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const shouldDisplayBackButton = currentStep > 1 && currentStep !== STEPS_COUNT
  const shouldDisplayNextButton = currentStep < STEPS_COUNT
  const shouldDisplayFinishButton = currentStep === STEPS_COUNT

  return (
    <div className="space-y-6 flex">
      <Stepper
        stepsCount={STEPS_COUNT}
        currentStep={currentStep}
        onStepChange={handleChangeStep}
      >
        <StepList>
          <Step
            stepNumber={1}
            title={t("steps.step1.title")}
            description={t("steps.step1.description")}
          />
          <Step
            stepNumber={2}
            title={t("steps.step2.title")}
            description={t("steps.step2.description")}
          />
          <Step
            stepNumber={3}
            title={t("steps.step3.title")}
            description={t("steps.step3.description")}
          />
        </StepList>
        <div className="min-h-[450px] flex flex-1 flex-col justify-between">
          <StepContent stepNumber={1}>
            <PlaylistSetupForm />
          </StepContent>
          <StepContent stepNumber={2}>
            <PlaylistSearchBandsForm />
          </StepContent>
          <StepContent stepNumber={3}>
            <PlaylistGetUrlLink />
          </StepContent>
          <div className="flex justify-end space-x-6 mt-8">
            {shouldDisplayBackButton && (
              <Button variant="ghost" onClick={handleBack}>
                {t("steps.navigation.previous")}
              </Button>
            )}
            {shouldDisplayNextButton && (
              <Button onClick={handleNext}>{t("steps.navigation.next")}</Button>
            )}
            {shouldDisplayFinishButton && (
              <Button asChild>
                <Link href="/">{t("steps.navigation.finish")}</Link>
              </Button>
            )}
          </div>
        </div>
      </Stepper>
    </div>
  )
}

export default GeneratePlaylistStepper
