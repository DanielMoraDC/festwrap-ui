import type { GetServerSidePropsContext } from "next"
import { signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"
import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/Button"
import Image from "next/image"
import enjoyMusicImage from "@public/enjoy-music.svg"
import useTranslation from "next-translate/useTranslation"
import { useRouter } from "next/router"

export default function SignIn() {
  const { t } = useTranslation("common")
  const router = useRouter()

  const { callbackUrl } = router.query

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Image
        src={enjoyMusicImage}
        alt="404"
        width="160"
        height="160"
        className="mx-auto"
      />
      <div className="flex flex-col gap-2 justify-center items-center">
        <Heading size="2xl">{t("auth.login.title")}</Heading>
        <p className="text-center text-light">{t("auth.login.description")}</p>
      </div>
      <Button
        onClick={() =>
          signIn("spotify", { callbackUrl: callbackUrl as string })
        }
      >
        {t("auth.login.button")}
      </Button>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return { redirect: { destination: "/" } }
  }

  return {
    props: {},
  }
}
