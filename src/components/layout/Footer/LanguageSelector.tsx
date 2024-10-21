import useTranslation from "next-translate/useTranslation"
import setLanguage from "next-translate/setLanguage"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Globe } from "lucide-react"

const languages = [
  { code: "en", translateKey: "languages.english" },
  { code: "es", translateKey: "languages.spanish" },
  { code: "ca", translateKey: "languages.catalan" },
]

export function LanguageSelectorComponent() {
  const { t, lang } = useTranslation("common")

  const handleLanguageChange = async (newLocale: string) => {
    await setLanguage(newLocale)
  }

  return (
    <Select onValueChange={handleLanguageChange} defaultValue={lang}>
      <SelectTrigger
        className="w-[150px]"
        aria-label={t("footer.selectLanguage")}
      >
        <Globe className="mr-2 h-4 w-4" />
        <SelectValue placeholder={t("footer.selectLanguage")} />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {t(lang.translateKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
