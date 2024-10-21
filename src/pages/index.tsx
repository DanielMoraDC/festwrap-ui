import HeroSection from "@/components/home/HeroSection/HeroSection"
import HowItWorksSection from "@/components/home/HowItWorksSection/HowItWorksSection"
import Head from "next/head"
import { GetStaticProps, GetStaticPropsContext } from "next"
import getT from "next-translate/getT"

type HomeTranslationProps = {
  heroSection: {
    title: string
    description: string
    button: string
  }
  meta: {
    title: string
    description: string
    keywords: string
  }
  howItWorksSection: {
    title: string
    description: string
    steps: {
      title: string
      description: string
    }[]
  }
}

type HomeProps = {
  translations: HomeTranslationProps
}

export default function Home({ translations }: HomeProps) {
  return (
    <>
      <Head>
        <title>{translations.meta.title}</title>
        <meta name="description" content={translations.meta.description} />
        <meta
          name="keywords"
          content="spotify, generator, playlist, festival, line-up"
        />
      </Head>
      <div className="flex flex-col gap-10">
        <HeroSection />
        <HowItWorksSection />
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const { locale } = context
  const t = await getT(locale || "en", "home")

  const translations: HomeTranslationProps = {
    heroSection: {
      title: t("heroSection.title"),
      description: t("heroSection.description"),
      button: t("heroSection.button"),
    },
    meta: {
      title: t("meta.title"),
      description: t("meta.description"),
      keywords: t("meta.keywords"),
    },
    howItWorksSection: {
      title: t("howItWorksSection.title"),
      description: t("howItWorksSection.description"),
      steps: t("howItWorksSection.steps", { returnObjects: true }),
    },
  }

  return {
    props: {
      translations,
    },
  }
}
