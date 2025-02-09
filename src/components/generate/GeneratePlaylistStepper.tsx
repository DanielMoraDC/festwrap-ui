import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PlaylistGetUrlLink from '@components/generate/PlaylistGetUrlLink/PlaylistGetUrlLink';
import PlaylistSearchBandsForm from '@components/generate/PlaylistSearchBandsForm/PlaylistSearchBandsForm';
import PlaylistSetupForm from '@components/generate/PlaylistSetupForm/PlaylistSetupForm';
import { Button } from '@components/ui/Button';
import { Stepper, StepList, Step, StepContent } from '@components/ui/Stepper';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { Form } from '@components/ui/Form';
import { PlaylistType } from '@/types/Playlist';
import { BandSearcher } from './PlaylistSearchBandsForm/BandSearcher';

const STEPS_COUNT = 3;

const formSchema = z
  .object({
    playlistType: z.enum([PlaylistType.New, PlaylistType.Existing]),
    name: z.string().optional(),
    playlistSelected: z.string().optional(),
    isPrivate: z.boolean(),
    bands: z.array(z.number().min(1)).nonempty('At least one band is required'),
  })
  .superRefine((data, ctx) => {
    if (data.playlistType === PlaylistType.New && !data.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Name is required for NEW role',
        path: ['name'],
      });
    }

    if (data.playlistType === PlaylistType.Existing && !data.playlistSelected) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Playlist is required for EXISTING role',
        path: ['playlistSelected'],
      });
    }
  });

export type FormSchemaType = z.infer<typeof formSchema>;

function GeneratePlaylistStepper({
  bandSearcher,
}: {
  bandSearcher: BandSearcher;
}) {
  const { t } = useTranslation('generate');
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playlistType: PlaylistType.New,
      name: '',
      playlistSelected: '',
      isPrivate: false,
      bands: [],
    },
  });

  const { handleSubmit, trigger, formState } = form;

  const handleNext = async () => {
    const isStepValid = await trigger([
      'name',
      'isPrivate',
      'playlistType',
      'playlistSelected',
    ]);
    if (isStepValid) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const onSubmit = (_values: FormSchemaType) => {};

  const handleChangeStep = (step: number) => {
    setCurrentStep(step);
  };

  const shouldDisplayBackButton =
    currentStep > 1 && currentStep !== STEPS_COUNT;
  const shouldDisplayNextButton = currentStep === 1 || currentStep === 2;

  return (
    <Form {...form}>
      <form className="space-y-6 flex" onSubmit={handleSubmit(onSubmit)}>
        <Stepper
          stepsCount={STEPS_COUNT}
          currentStep={currentStep}
          onStepChange={handleChangeStep}
          isCompleted={formState.isSubmitted}
        >
          <StepList>
            <Step
              stepNumber={1}
              title={t('steps.step1.title')}
              description={t('steps.step1.description')}
            />
            <Step
              stepNumber={2}
              title={t('steps.step2.title')}
              description={t('steps.step2.description')}
            />
            <Step
              stepNumber={3}
              title={t('steps.step3.title')}
              description={t('steps.step3.description')}
            />
          </StepList>
          <div className="min-h-[450px] flex flex-1 flex-col justify-between">
            <StepContent stepNumber={1}>
              <PlaylistSetupForm />
            </StepContent>
            <StepContent stepNumber={2}>
              <PlaylistSearchBandsForm bandSearcher={bandSearcher} />
            </StepContent>
            <StepContent stepNumber={3}>
              <PlaylistGetUrlLink />
            </StepContent>
            <div className="flex justify-end space-x-6 mt-8">
              {shouldDisplayBackButton && (
                <Button variant="ghost" onClick={handleBack}>
                  {t('steps.navigation.previous')}
                </Button>
              )}
              {shouldDisplayNextButton && (
                <Button onClick={handleNext}>
                  {t('steps.navigation.next')}
                </Button>
              )}
            </div>
          </div>
        </Stepper>
      </form>
    </Form>
  );
}

export default GeneratePlaylistStepper;
