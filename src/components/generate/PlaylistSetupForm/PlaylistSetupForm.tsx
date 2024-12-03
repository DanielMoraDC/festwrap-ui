import Heading from "@components/ui/Heading"
import { Input } from "@components/ui/Input"
import { Label } from "@components/ui/Label"
import {
  RadioGroupButtons,
  RadioGroupButton,
  RadioGroupButtonTitle,
  RadioGroupButtonDescription,
} from "@components/ui/RadioGroupButtons"
import { Switch } from "@components/ui/Switch"
import useTranslation from "next-translate/useTranslation"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/Select"

const PlaylistOptions = {
  NEW: "new",
  EXISTING: "existing",
}

const PlaylistSetupForm = () => {
  const { t } = useTranslation("generate")
  const [playlistSelection, setPlaylistSelection] = useState(
    PlaylistOptions.NEW
  )

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

      <RadioGroupButtons
        defaultValue={playlistSelection}
        onChange={(value) => setPlaylistSelection(value)}
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
      {playlistSelection === PlaylistOptions.NEW ? (
        <>
          <div className="space-y-2 mt-6">
            <Label htmlFor="playlist-name">
              {t("steps.step1.form.createNewPlaylist.giveAName")}
            </Label>
            <Input
              id="playlist-name"
              placeholder={t(
                "steps.step1.form.createNewPlaylist.namePlaceholder"
              )}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="private-playlist"
              title={t(
                "steps.step1.form.createNewPlaylist.privatePlaylist.title"
              )}
            />
            <Label htmlFor="private-playlist" className="flex flex-col">
              <span className="text-sm font-medium">
                {t("steps.step1.form.createNewPlaylist.privatePlaylist.title")}
              </span>
              <span className="text-sm text-muted-foreground text-dark-blue">
                {t(
                  "steps.step1.form.createNewPlaylist.privatePlaylist.description"
                )}
              </span>
            </Label>
          </div>
        </>
      ) : (
        <div className="space-y-2 mt-6">
          <Label htmlFor="select-existing-playlist">
            {t("steps.step1.form.useExistingPlaylist.selectPlaylist")}
          </Label>
          <Select>
            <SelectTrigger className="w-full" id="select-existing-playlist">
              <SelectValue
                placeholder={t(
                  "steps.step1.form.useExistingPlaylist.selectPlaylist"
                )}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Playlist 1</SelectItem>
              <SelectItem value="2">Playlist 2</SelectItem>
              <SelectItem value="3">Playlist 3</SelectItem>
              <SelectItem value="4">Playlist 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  )
}

export default PlaylistSetupForm
