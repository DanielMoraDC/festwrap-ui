"use client"
import Link from "next/link"
import Button from "@/components/ui/Button"
import NavLink from "@/components/layout/Header/NavbarMenu/NavLink"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import SpotifyAuthDropdown from "./SpotifyAuthDropdown"

const MobileNavbarMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

  const handleMenuOpen = () => {
    setIsMenuOpen(true)
  }

  return (
    <>
      <div className="flex md:hidden justify-end">
        <Button variant="ghost" onClick={handleMenuOpen} isIconOnly>
          <Menu size={24} />
        </Button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-full bg-white z-20">
          <div className="flex flex-col gap-10 px-4 py-8">
            <div className="flex items-center justify-between">
              <div className="flex justify-start">
                <Link href="/" onClick={handleMenuClose}>
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
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={handleMenuClose} isIconOnly>
                  <X size={24} />
                </Button>
              </div>
            </div>
            <nav className="flex flex-col items-center justify-center gap-6 py-4">
              <NavLink
                variant="mobile"
                href="/get-started"
                onClick={handleMenuClose}
              >
                Get started
              </NavLink>
              <NavLink
                variant="mobile"
                href="/how-it-works"
                onClick={handleMenuClose}
              >
                How it works?
              </NavLink>
              <NavLink
                variant="mobile"
                href="/about-us"
                onClick={handleMenuClose}
              >
                About us
              </NavLink>
              <SpotifyAuthDropdown isMobileScreen />
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileNavbarMenu
