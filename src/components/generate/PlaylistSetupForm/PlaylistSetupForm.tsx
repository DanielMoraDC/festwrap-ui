import Heading from "@components/ui/Heading"
import { Input } from "@components/ui/Input"
import {
  RadioGroupButtons,
  RadioGroupButton,
  RadioGroupButtonTitle,
  RadioGroupButtonDescription,
} from "@components/ui/RadioGroupButtons"
import { Switch } from "@components/ui/Switch"
import useTranslation from "next-translate/useTranslation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/Select"
import { useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/Form"
import ErrorMessage from "@/components/ui/ErrorMessage"

const PlaylistOptions = {
  NEW: "new",
  EXISTING: "existing",
}

const PlaylistSetupForm = () => {
  const { watch, control, formState } = useFormContext()
  const { errors } = formState
  const { t } = useTranslation("generate")

  const playlistSelection = watch("playlistType")

  return (
    <>
      <div className="flex flex-col space-y-2">
        <Heading as="h2" size="2xl" color="primary">
          {t("steps.step1.title")}
        </Heading>
        <p className="text-lg text-muted-foreground mt-2 text-dark-blue font-medium">
          {t("steps.step1.description")}
        </p>
      </div>
      <FormField
        control={control}
        name="playlistType"
        render={({ field }) => (
          <RadioGroupButtons
            defaultValue={field.value}
            onChange={(value) => field.onChange(value)}
          >
            <RadioGroupButton value={PlaylistOptions.NEW}>
              <RadioGroupButtonTitle>
                {t("steps.step1.form.createNewPlaylist.title")}
              </RadioGroupButtonTitle>
              <RadioGroupButtonDescription>
                {t("steps.step1.form.createNewPlaylist.description")}
              </RadioGroupButtonDescription>
            </RadioGroupButton>
            <RadioGroupButton value={PlaylistOptions.EXISTING}>
              <RadioGroupButtonTitle>
                {t("steps.step1.form.useExistingPlaylist.title")}
              </RadioGroupButtonTitle>
              <RadioGroupButtonDescription>
                {t("steps.step1.form.useExistingPlaylist.description")}
              </RadioGroupButtonDescription>
            </RadioGroupButton>
          </RadioGroupButtons>
        )}
      />
      {playlistSelection === PlaylistOptions.NEW ? (
        <>
          <div className="space-y-2 mt-6">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("steps.step1.form.createNewPlaylist.giveAName")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "steps.step1.form.createNewPlaylist.namePlaceholder"
                      )}
                      {...field}
                    />
                  </FormControl>
                  {errors.name?.message && (
                    <ErrorMessage>
                      {t("steps.errors.name.required")}
                    </ErrorMessage>
                  )}
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-readonly
                    title={t(
                      "steps.step1.form.createNewPlaylist.privatePlaylist.title"
                    )}
                  />
                </FormControl>
                <FormLabel className="flex flex-col">
                  <span className="text-sm font-medium">
                    {t(
                      "steps.step1.form.createNewPlaylist.privatePlaylist.title"
                    )}
                  </span>
                  <span className="text-sm text-muted-foreground text-dark-blue">
                    {t(
                      "steps.step1.form.createNewPlaylist.privatePlaylist.description"
                    )}
                  </span>
                </FormLabel>
              </FormItem>
            )}
          />
        </>
      ) : (
        <div className="space-y-2 mt-6">
          <FormField
            control={control}
            name="playlistSelected"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("steps.step1.form.useExistingPlaylist.selectPlaylist")}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t(
                          "steps.step1.form.useExistingPlaylist.selectPlaylist"
                        )}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Playlist 1</SelectItem>
                    <SelectItem value="2">Playlist 2</SelectItem>
                    <SelectItem value="3">Playlist 3</SelectItem>
                    <SelectItem value="4">Playlist 4</SelectItem>
                  </SelectContent>
                </Select>
                {errors.playlistSelected?.message && (
                  <ErrorMessage>
                    {t("steps.errors.playlistSelected.required")}
                  </ErrorMessage>
                )}
              </FormItem>
            )}
          />
        </div>
      )}
    </>
  )
}

export default PlaylistSetupForm
