import Head from "next/head"
import { GetStaticProps, GetStaticPropsContext } from "next"
import getT from "next-translate/getT"
import GeneratePlaylistStepper from "@components/generate/GeneratePlaylistStepper"

type GenerateTranslationProps = {
  meta: {
    title: string
    description: string
    keywords: string
  }
}

export type GenerateProps = {
  translations: GenerateTranslationProps
}

export default function Generate({ translations }: GenerateProps) {
  return (
    <>
      <Head>
        <title>{translations.meta.title}</title>
        <meta name="description" content={translations.meta.description} />
        <meta name="keywords" content={translations.meta.keywords} />
      </Head>
      <GeneratePlaylistStepper />
    </>
  )
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const { locale } = context
  const t = await getT(locale || "en", "generate")

  const translations: GenerateTranslationProps = {
    meta: {
      title: t("meta.title"),
      description: t("meta.description"),
      keywords: t("meta.keywords"),
    },
  }

  return {
    props: {
      translations,
    },
  }
}
