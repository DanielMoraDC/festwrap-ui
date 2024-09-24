"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import NavLink from "@components/NavLink"
import Button from "@components/Button"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-8">
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
          <nav className="hidden md:flex gap-10">
            <NavLink href="/get-started">Get started</NavLink>
            <NavLink href="/how-it-works">How does it works?</NavLink>
            <NavLink href="/about-us">About us</NavLink>
          </nav>
          <div className="flex md:hidden justify-end">
            <span onClick={() => setIsMenuOpen((prevValue) => !prevValue)}>
              Menu
            </span>
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
                    <Button
                      accent="secondary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
                <nav className="flex flex-col gap-6">
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
        </div>
      </div>
    </header>
  )
}

export default Header
