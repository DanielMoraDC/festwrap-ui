import Image from "next/image"
import Link from "next/link"

const LogoLink = () => {
  return (
    <Link href="/">
      <Image
        src="/logo.svg"
        alt="Festwrap logo"
        width={150}
        height={150}
        className="h-auto"
        priority
      />
    </Link>
  )
}

export default LogoLink
