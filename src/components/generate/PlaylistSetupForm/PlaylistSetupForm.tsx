import Heading from '@components/ui/Heading';
import { Input } from '@components/ui/Input';
import {
  RadioGroupButtons,
  RadioGroupButton,
  RadioGroupButtonTitle,
  RadioGroupButtonDescription,
} from '@components/ui/RadioGroupButtons';
import { Switch } from '@components/ui/Switch';
import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/Form';
import ErrorMessage from '@/components/ui/ErrorMessage';
import PlaylistSearcher from './PlaylistSearcher';
import { PlaylistCreationMode } from '../GeneratePlaylistStepper';
import { Textarea } from '@/components/ui/Textarea';

const PlaylistSetupForm = () => {
  const { watch, control, formState } = useFormContext();
  const { errors } = formState;

  const { t } = useTranslation('generate');

  const playlistModeSelected = watch('playlistCreationMode');

  return (
    <>
      <div className="flex flex-col space-y-2" data-testid="playlist-setup">
        <Heading as="h2" size="2xl" color="primary" data-testid="title">
          {t('steps.step1.title')}
        </Heading>
        <p className="text-lg text-muted-foreground mt-2 text-dark-blue font-medium" data-testid="description">
          {t('steps.step1.description')}
        </p>
      </div>
      <FormField
        control={control}
        name="playlistCreationMode"
        render={({ field }) => (
          <RadioGroupButtons
            defaultValue={field.value}
            onChange={(value) => field.onChange(value)}
          >
            <RadioGroupButton value={PlaylistCreationMode.New}>
              <RadioGroupButtonTitle>
                {t('steps.step1.form.createNewPlaylist.title')}
              </RadioGroupButtonTitle>
              <RadioGroupButtonDescription>
                {t('steps.step1.form.createNewPlaylist.description')}
              </RadioGroupButtonDescription>
            </RadioGroupButton>
            <RadioGroupButton value={PlaylistCreationMode.Existing}>
              <RadioGroupButtonTitle>
                {t('steps.step1.form.useExistingPlaylist.title')}
              </RadioGroupButtonTitle>
              <RadioGroupButtonDescription>
                {t('steps.step1.form.useExistingPlaylist.description')}
              </RadioGroupButtonDescription>
            </RadioGroupButton>
          </RadioGroupButtons>
        )}
      />
      {playlistModeSelected === PlaylistCreationMode.New ? (
        <>
          <div className="flex flex-col space-y-3 mt-6">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('steps.step1.form.createNewPlaylist.giveAName')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder={t(
                        'steps.step1.form.createNewPlaylist.namePlaceholder'
                      )}
                      {...field}
                    />
                  </FormControl>
                  {errors.name?.message && (
                    <ErrorMessage>
                      {t('steps.errors.name.required')}
                    </ErrorMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('steps.step1.form.createNewPlaylist.giveADescription')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        'steps.step1.form.createNewPlaylist.descriptionPlaceholder'
                      )}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                      title={t(
                        'steps.step1.form.createNewPlaylist.publicPlaylist.title'
                      )}
                    />
                  </FormControl>
                  <FormLabel className="flex flex-col">
                    <span className="text-sm font-medium">
                      {t(
                        'steps.step1.form.createNewPlaylist.publicPlaylist.title'
                      )}
                    </span>
                    <span className="text-sm text-muted-foreground text-dark-blue">
                      {t(
                        'steps.step1.form.createNewPlaylist.publicPlaylist.description'
                      )}
                    </span>
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </>
      ) : (
        <div className="space-y-2 mt-6">
          <PlaylistSearcher />
        </div>
      )}
    </>
  );
};

export default PlaylistSetupForm;
