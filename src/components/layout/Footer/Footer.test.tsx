import useTranslation from "next-translate/useTranslation"
import { describe, expect, test, vi, beforeEach } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import Footer from "./Footer"
import setLanguage from "next-translate/setLanguage"

vi.mock("next-translate/useTranslation", () => ({
  __esModule: true,
  default: vi.fn(),
}))

vi.mock("next-translate/setLanguage", () => ({
  __esModule: true,
  default: vi.fn(),
}))

const mockT: any = (key: string) => key

describe("Footer", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
  })

  test("should render the footer with the correct links", () => {
    vi.mocked(useTranslation).mockReturnValue({
      t: mockT,
      lang: "en",
    })

    render(<Footer />)

    expect(screen.getByText("nav.getStarted")).toBeInTheDocument()
    expect(screen.getByText("nav.aboutUs")).toBeInTheDocument()
    expect(screen.getByText("nav.termsOfService")).toBeInTheDocument()
    expect(screen.getByText("nav.privacyPolicy")).toBeInTheDocument()
  })

  test("should change the language when clicking on the language button", async () => {
    vi.mocked(useTranslation).mockReturnValue({
      t: mockT,
      lang: "en",
    })

    render(<Footer />)

    const languageButton = screen.getByRole("combobox")
    languageButton.click()

    const spanishOptionItem = await screen.findByText("languages.spanish")
    fireEvent.click(spanishOptionItem)

    expect(setLanguage).toHaveBeenCalledWith("es")
  })
})
