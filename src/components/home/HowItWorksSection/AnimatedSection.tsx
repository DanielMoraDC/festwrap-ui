import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Image, { StaticImageData } from "next/image"
import Heading from "@/components/ui/Heading"
import darkSilverShapeImage from "@public/dark-silver-shape.svg"
import platinumShapeImage from "@public/platinum-shape.svg"
import { fadeInUp } from "@/lib/motionVariants"

const PlatinumShape = () => {
  return <Image src={platinumShapeImage} alt="Dark silver shape" />
}

const DarkSilverShape = () => {
  return <Image src={darkSilverShapeImage} alt="Platinum shape" />
}

const AnimatedSectionTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <Heading as="h3" size="xl" color="dark" weight="normal">
      {children}
    </Heading>
  )
}

const AnimatedSectionImage = ({
  src,
  alt,
}: {
  src: StaticImageData
  alt: string
}) => {
  return <Image src={src} alt={alt} className="h-40 w-auto" />
}

type BackgroundShapeType = "platinum" | "dark-silver"

const backgroundShapeVariants: Record<BackgroundShapeType, React.FC> = {
  platinum: PlatinumShape,
  "dark-silver": DarkSilverShape,
}

type AnimatedSectionProps = {
  backgroundShape: BackgroundShapeType
  children: React.ReactNode
  floatingPosition: string
}

const AnimatedSection = ({
  backgroundShape,
  children,
  floatingPosition,
}: AnimatedSectionProps) => {
  const BackgroundShape = backgroundShapeVariants[backgroundShape]
  return (
    <div className="relative w-full sm:h-80">
      <motion.div
        className={cn("relative sm:absolute", floatingPosition)}
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <BackgroundShape />
        <div className="absolute top-0 left-2 sm:left-10 w-full h-full flex items-center justify-center">
          <div className="flex items-center gap-4">{children}</div>
        </div>
      </motion.div>
    </div>
  )
}

AnimatedSection.Title = AnimatedSectionTitle
AnimatedSection.Image = AnimatedSectionImage

export default AnimatedSection
