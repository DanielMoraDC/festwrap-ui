"use client"
import useTranslation from "next-translate/useTranslation"
import Button from "@/src/components/ui/Button"
import { fadeInStaggerRight, fadeInUp } from "@/src/lib/motionVariants"
import { motion } from "framer-motion"
import Link from "next/link"
import Trans from "next-translate/Trans"

const HeroSectionLeft = () => {
  const { t } = useTranslation("home")
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
        <Trans
          i18nKey="home:heroSection.title"
          components={[
            <span key="home-title-span-key" className="text-light" />,
          ]}
        />
      </motion.h1>
      <motion.p
        className="text-xl font-medium mb-8 text-dark-blue"
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        {t("heroSection.subtitle")}
      </motion.p>
      <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
        <Button variant="primary" as={Link} href="/get-started">
          {t("heroSection.button")}
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default HeroSectionLeft
