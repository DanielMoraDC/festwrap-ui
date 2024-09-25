"use client"
import Link from "next/link"
import Button from "../Button"
import NavLink from "./NavLink"
import Image from "next/image"
import { useState } from "react"

const MobileNavbarMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <div className="flex md:hidden justify-end">
        <Button
          variant="ghost"
          onClick={() => setIsMenuOpen((prevValue) => !prevValue)}
        >
          Menu
        </Button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-full bg-white">
          <div className="flex flex-col gap-10 px-4 py-8">
            <div className="flex items-center justify-between">
              <div className="flex justify-start">
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
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => setIsMenuOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
            <nav className="flex flex-col items-center justify-center gap-6 py-4">
              <NavLink variant="mobile" href="/get-started">
                Get started
              </NavLink>
              <NavLink variant="mobile" href="/how-it-works">
                How does it works?
              </NavLink>
              <NavLink variant="mobile" href="/about-us">
                About us
              </NavLink>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileNavbarMenu
