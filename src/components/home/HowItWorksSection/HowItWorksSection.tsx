import { motion } from "framer-motion"
import Heading from "@components/ui/Heading"
import customizePlaylistImage from "@public/customize-playlist.svg"
import spotifyLockImage from "@public/spotify-lock.svg"
import searchArtistsImage from "@public/search-artists.svg"
import AnimatedSection from "./AnimatedSection"
import { fadeInStaggerRight, fadeInUp } from "@/lib/motionVariants"
import useTranslation from "next-translate/useTranslation"

const HowItWorksSection = () => {
  const { t } = useTranslation("home")
  return (
    <section className="flex flex-col py-6 px-6">
      <motion.div
        variants={fadeInStaggerRight}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center"
      >
        <motion.div className="mb-8" variants={fadeInUp}>
          <Heading as="h2" size="3xl" color="dark" weight="semibold">
            {t("howItWorksSection.title")}
          </Heading>
        </motion.div>
        <div className="flex flex-col w-full md:w-70p lg:w-60p xl:w-1/2 gap-6">
          <AnimatedSection
            backgroundShape="platinum"
            floatingPosition="sm:top-10p sm:-left-5p md:-left-20p"
          >
            <AnimatedSection.Image src={spotifyLockImage} />
            <AnimatedSection.Title>
              {t("howItWorksSection.step1.title")}
            </AnimatedSection.Title>
          </AnimatedSection>
          <AnimatedSection
            backgroundShape="dark-silver"
            floatingPosition="sm:top-10p sm:right-0 md:-top-0 md:-right-20p"
          >
            <AnimatedSection.Image src={searchArtistsImage} />
            <AnimatedSection.Title>
              {t("howItWorksSection.step2.title")}
            </AnimatedSection.Title>
          </AnimatedSection>
          <AnimatedSection
            backgroundShape="platinum"
            floatingPosition="sm:-top-20p sm:-left-5p md:-left-20p"
          >
            <AnimatedSection.Image src={customizePlaylistImage} />
            <AnimatedSection.Title>
              {t("howItWorksSection.step3.title")}
            </AnimatedSection.Title>
          </AnimatedSection>
        </div>
      </motion.div>
    </section>
  )
}

export default HowItWorksSection
