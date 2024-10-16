import Link from "next/link"

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-secondary bg-opacity-30 text-dark">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6">
          <nav className="flex flex-col sm:flex-row gap-5 sm:gap-10 font-medium text-sm">
            <Link href="/get-started">Get started</Link>
            <Link href="/about-us">About us</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </nav>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; {currentYear} Festwrap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
