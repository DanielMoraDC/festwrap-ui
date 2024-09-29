import Image from "next/image"
import Link from "next/link"
import Header from "@components/layout/Header/Header"
import Footer from "@/components/layout/Footer"
import Main from "@/components/layout/Main"

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Main>{children}</Main>
      <Footer />
    </div>
  )
}
