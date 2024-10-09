import Button from "@/components/ui/Button"
import { fadeInStaggerRight, fadeInUp } from "@/lib/motionVariants"
import { motion } from "framer-motion"
import Link from "next/link"

const HeroSectionLeft = () => {
  return (
    <motion.div
      className="md:w-1/2 mb-16 md:mb-0 md:pr-10 text-dark"
      variants={fadeInStaggerRight}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-4xl sm:text-3xl md:text-4xl font-bold mb-4"
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        Spotify playlists <span className="text-light">Generator </span>
        using festival line-up
      </motion.h1>
      <motion.p
        className="text-xl font-medium mb-8 text-dark-blue"
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        Generate playlist based on the current set that each group are playing
        in the tour using the API
      </motion.p>
      <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
        <Button variant="primary" as={Link} href="/get-started">
          Get started
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default HeroSectionLeft
