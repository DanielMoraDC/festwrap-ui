import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Chip, { ChipVariant } from "./Chip"
import { twMerge } from "tailwind-merge"

type ChipType = {
  color: ChipVariant
  children: string
  classNamePosition: string
}

const chipsList: ChipType[] = [
  {
    color: "primary",
    children: "Holding Absence",
    classNamePosition: "top-2 left-28",
  },
  {
    color: "secondary",
    children: "While Shee Sleeps",
    classNamePosition: "bottom-6 right-7",
  },
  {
    color: "primary",
    children: "Currents",
    classNamePosition: "bottom-28 right-6",
  },
  {
    color: "primary",
    children: "Knocked Loose",
    classNamePosition: "top-8 right-10",
  },
  {
    color: "secondary",
    children: "Polaris",
    classNamePosition: "bottom-14 left-10",
  },
  {
    color: "secondary",
    children: "NOFX",
    classNamePosition: "top-16 left-20",
  },
  {
    color: "primary",
    children: "Thy Art is Murder",
    classNamePosition: "bottom-0 left-28",
  },
]

const FloatingChips = () => {
  return chipsList.map((chip, index) => (
    <motion.div
      key={index}
      className={twMerge("hidden sm:block absolute", chip.classNamePosition)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <Chip size="sm" color={chip.color}>
        {chip.children}
      </Chip>
    </motion.div>
  ))
}

export default FloatingChips