import HeroSectionRight from "./HeroSectionRight"
import HeroSectionLeft from "./HeroSectionLeft"

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center py-6 md:flex-row md:justify-between">
      <HeroSectionLeft />
      <HeroSectionRight />
    </div>
  )
}

export default HeroSection
