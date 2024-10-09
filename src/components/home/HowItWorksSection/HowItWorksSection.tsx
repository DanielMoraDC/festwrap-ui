import { motion } from "framer-motion"
import Heading from "@/components/ui/Heading"
import customizePlaylistImage from "@public/customize-playlist.svg"
import spotifyLockImage from "@public/spotify-lock.svg"
import searchArtistsImage from "@public/search-artists.svg"
import AnimatedSection from "./AnimatedSection"
import { fadeInStaggerRight, fadeInUp } from "@/lib/motionVariants"

const HowItWorksSection = () => {
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
            How It Works
          </Heading>
        </motion.div>
        <div className="flex flex-col w-full md:w-70p lg:w-60p xl:w-1/2 gap-6">
          <AnimatedSection
            backgroundShape="platinum"
            floatingPosition="sm:top-10p sm:-left-5p md:-left-20p"
          >
            <AnimatedSection.Image src={spotifyLockImage} alt="Spotify lock" />
            <AnimatedSection.Title>
              Sign in on your Spotify account
            </AnimatedSection.Title>
          </AnimatedSection>
          <AnimatedSection
            backgroundShape="dark-silver"
            floatingPosition="sm:top-10p sm:right-0 md:-top-0 md:-right-20p"
          >
            <AnimatedSection.Image
              src={searchArtistsImage}
              alt="Search artists"
            />
            <AnimatedSection.Title>
              Find and select the artists using Spotify search engine
            </AnimatedSection.Title>
          </AnimatedSection>
          <AnimatedSection
            backgroundShape="platinum"
            floatingPosition="sm:-top-20p sm:-left-5p md:-left-20p"
          >
            <AnimatedSection.Image
              src={customizePlaylistImage}
              alt="Customize playlist"
            />
            <AnimatedSection.Title>
              Check the generated playlist and customize it as you like
            </AnimatedSection.Title>
          </AnimatedSection>
        </div>
      </motion.div>
    </section>
  )
}

export default HowItWorksSection
