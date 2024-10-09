import HeroSection from "@/components/home/HeroSection/HeroSection"
import HowItWorksSection from "@/components/home/HowItWorksSection/HowItWorksSection"
import Head from "next/head"

const Home = () => {
  return (
    <>
      <Head>
        <title>Home | Festwrap</title>
        <meta
          name="description"
          content="Spotify playlists Generator using festival line-up"
        />
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

export default Home
