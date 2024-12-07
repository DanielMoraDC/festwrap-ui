import { Button } from "@components/ui/Button"
import useTranslation from "next-translate/useTranslation"
import Image from "next/image"
import Link from "next/link"

export default function Custom404() {
  const { t } = useTranslation("common")
  return (
    <div className="flex flex-col py-10 gap-6 items-center justify-center">
      <Image
        src="/not-found.svg"
        alt="404"
        width="150"
        height="150"
        className="mx-auto"
      />
      <div className="flex flex-col gap-3 justify-center items-center">
        <h1 className="text-3xl text-dark font-medium text-center">404</h1>
        <p className="text-light text-center">{t("notFound.message")}</p>
        <Button asChild variant="ghost">
          <Link href="/">{t("notFound.button")}</Link>
        </Button>
      </div>
    </div>
  )
}
