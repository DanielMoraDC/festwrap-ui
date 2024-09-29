import Button from "@/components/ui/Button"
import Image from "next/image"
import Link from "next/link"

export default function Custom404() {
  return (
    <div className="flex flex-col py-10 gap-6 items-center justify-center">
      <Image
        src="/not-found.svg"
        alt="404"
        width="150"
        height="150"
        className="mx-auto"
      />
      <div className="flex flex-col gap-3 justify-center items-center">
        <h1 className="text-3xl text-dark font-medium text-center">404</h1>
        <p className="text-light text-center">
          It seems like you got a little bit lost
        </p>
        <Button as={Link} variant="ghost" href="/">
          Go back home
        </Button>
      </div>
    </div>
  )
}
