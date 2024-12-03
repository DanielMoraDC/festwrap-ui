import { describe, expect, vi, it, beforeEach } from "vitest"
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import GeneratePlaylistPage, { GenerateProps } from "@/pages/generate"

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt } = props
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  },
}))

const staticTranslations: GenerateProps = {
  translations: {
    meta: {
      title: "Generate a playlist",
      description: "Generate a playlist description",
      keywords: "Generate a playlist keywords",
    },
  },
}

userEvent.setup()

beforeEach(() => {
  vi.resetAllMocks()
  cleanup()
})

describe("GeneratePlaylistPage", () => {
  it("should render the form with the first step displayed", async () => {
    render(<GeneratePlaylistPage {...staticTranslations} />)

    const firstNavigationStepButton = screen.getByRole("button", {
      name: /steps.step1.title/i,
    })
    expect(firstNavigationStepButton).toBeInTheDocument()
    expect(
      within(firstNavigationStepButton).getByText(/steps.step1.description/i)
    ).toBeInTheDocument()

    const nextButton = screen.getByRole("button", {
      name: /steps.navigation.next/i,
    })
    expect(nextButton).toBeInTheDocument()

    const previousButton = screen.queryByRole("button", {
      name: /steps.navigation.previous/i,
    })
    expect(previousButton).not.toBeInTheDocument()

    const firstStepContent = screen.getByRole("tabpanel")
    expect(
      within(firstStepContent).getByText(/steps.step1.title/i)
    ).toBeInTheDocument()
    expect(
      within(firstStepContent).getByText(/steps.step1.description/i)
    ).toBeInTheDocument()
  })

  it("should fill the form and navigate to the next step when clicking the next button", async () => {
    render(<GeneratePlaylistPage {...staticTranslations} />)

    const firstNavigationStepButton = screen.getByRole("button", {
      name: /steps.step1.title/i,
    })
    expect(firstNavigationStepButton).toBeInTheDocument()

    const firstStepContent = screen.getByRole("tabpanel")
    expect(
      within(firstStepContent).getByText(/steps.step1.title/i)
    ).toBeInTheDocument()

    // Select the new playlist option
    const createNewPlaylistRadio = screen.getByRole("radio", {
      name: /steps.step1.form.createNewPlaylist.title/i,
    })
    userEvent.click(createNewPlaylistRadio)

    // Fill the playlist name
    const playlistNameInput = screen.getByLabelText(
      /steps.step1.form.createNewPlaylist.giveAName/i
    )
    userEvent.type(playlistNameInput, "My new playlist")

    // Enable private playlist
    const privatePlaylistSwitch = screen.getByRole("switch", {
      name: /steps.step1.form.createNewPlaylist.privatePlaylist.title/i,
    })
    userEvent.click(privatePlaylistSwitch)

    // Click next
    const nextButton = screen.getByRole("button", {
      name: /steps.navigation.next/i,
    })
    userEvent.click(nextButton)

    // Check the second step is displayed
    const secondNavigationStepButton = screen.getByRole("button", {
      name: /steps.step2.title/i,
    })
    expect(secondNavigationStepButton).toBeInTheDocument()
  })

  it("should navigate to the previous step when clicking the previous button", async () => {
    render(<GeneratePlaylistPage {...staticTranslations} />)

    const firstNavigationStepButton = screen.getByRole("button", {
      name: /steps.step1.title/i,
    })
    expect(firstNavigationStepButton).toBeInTheDocument()

    const firstStepContent = screen.getByRole("tabpanel")
    expect(
      within(firstStepContent).getByText(/steps.step1.title/i)
    ).toBeInTheDocument()

    // Click next
    const nextButton = screen.getByRole("button", {
      name: /steps.navigation.next/i,
    })
    userEvent.click(nextButton)

    // Check the second step is displayed
    waitFor(() => {
      const secondStepContent = screen.getByRole("tabpanel")
      expect(
        within(secondStepContent).getByText(/steps.step2.title/i)
      ).toBeInTheDocument()

      const previousButton = screen.getByRole("button", {
        name: /steps.navigation.previous/i,
      })
      userEvent.click(previousButton)
    })

    expect(
      within(firstStepContent).getByText(/steps.step1.title/i)
    ).toBeInTheDocument()
  })

  it("should navigate to the last step when filling the form and clicking the next button", async () => {
    render(<GeneratePlaylistPage {...staticTranslations} />)

    const firstNavigationStepButton = screen.getByRole("button", {
      name: /steps.step1.title/i,
    })
    expect(firstNavigationStepButton).toBeInTheDocument()

    const firstStepContent = screen.getByRole("tabpanel")
    expect(
      within(firstStepContent).getByText(/steps.step1.title/i)
    ).toBeInTheDocument()

    // Click next
    const nextButton = screen.getByRole("button", {
      name: /steps.navigation.next/i,
    })
    userEvent.click(nextButton)

    // Check the second step is displayed
    waitFor(() => {
      const secondStepContent = screen.getByRole("tabpanel")
      expect(
        within(secondStepContent).getByText(/steps.step2.title/i)
      ).toBeInTheDocument()

      // Fill the form
      const searchInput = screen.getByRole("textbox", {
        name: /steps.step2.form.searchBands.search/i,
      })
      userEvent.type(searchInput, "Metallica")

      // Click next
      userEvent.click(nextButton)
    })

    // Check the third step is displayed
    waitFor(() => {
      const thirdStepContent = screen.getByRole("tabpanel")
      expect(
        within(thirdStepContent).getByText(/steps.step3.title/i)
      ).toBeInTheDocument()
    })

    waitFor(() => {
      // Check the next button is not displayed
      const nextButtonAfterLastStep = screen.queryByRole("button", {
        name: /steps.navigation.next/i,
      })
      expect(nextButtonAfterLastStep).not.toBeInTheDocument()

      // Check the finish button is displayed
      const finishButton = screen.getByRole("button", {
        name: /steps.navigation.finish/i,
      })
      expect(finishButton).toBeInTheDocument()
    })
  })
})
