import { motion } from "framer-motion"
import Chip, { ChipVariant } from "@/components/ui/Chip"
import { twMerge } from "tailwind-merge"
import { scaleUp } from "@/lib/motionVariants"

type ChipType = {
  color: ChipVariant
  children: string
  classNamePosition: string
}

const chipsList: ChipType[] = [
  {
    color: "primary",
    children: "Holding Absence",
    classNamePosition: "top-5p left-10p sm:left-20p",
  },
  {
    color: "secondary",
    children: "While Shee Sleeps",
    classNamePosition: "bottom-10p right-5p sm:right-10p",
  },
  {
    color: "primary",
    children: "Currents",
    classNamePosition: "bottom-25p right-5p sm:right-10p",
  },
  {
    color: "primary",
    children: "Knocked Loose",
    classNamePosition: "top-10p right-5p sm:right-10p",
  },
  {
    color: "secondary",
    children: "Polaris",
    classNamePosition: "bottom-20p left-10p sm:left-15p",
  },
  {
    color: "secondary",
    children: "NOFX",
    classNamePosition: "top-20p left-10p sm:left-20p",
  },
  {
    color: "primary",
    children: "Thy Art is Murder",
    classNamePosition: "bottom-0 left-10p sm:left-30p",
  },
]

const FloatingChips = () => {
  return chipsList.map((chip, index) => (
    <motion.div
      key={index}
      className={twMerge("absolute", chip.classNamePosition)}
      variants={scaleUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <Chip size="sm" color={chip.color}>
        {chip.children}
      </Chip>
    </motion.div>
  ))
}

export default FloatingChips
