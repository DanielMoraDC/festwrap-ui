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

  it('should display the error message when the "Create new playlist" option is selected and the playlist name is not filled', async () => {
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
    await userEvent.click(createNewPlaylistRadio)

    // Enable private playlist
    const privatePlaylistSwitch = screen.getByRole("switch", {
      name: /steps.step1.form.createNewPlaylist.privatePlaylist.title/i,
    })
    await userEvent.click(privatePlaylistSwitch)

    // Click next
    const nextButton = screen.getByRole("button", {
      name: /steps.navigation.next/i,
    })
    await userEvent.click(nextButton)

    // Check the error message is displayed
    const playlistNameError = await waitFor(() => {
      return screen.getByText(/steps.errors.name.required/i)
    })

    expect(playlistNameError).toBeInTheDocument()
  })

  it('should display the error message when the "Use existing playlist" option is selected and the playlist is not selected', async () => {
    render(<GeneratePlaylistPage {...staticTranslations} />)

    const firstNavigationStepButton = screen.getByRole("button", {
      name: /steps.step1.title/i,
    })
    expect(firstNavigationStepButton).toBeInTheDocument()

    const firstStepContent = screen.getByRole("tabpanel")
    expect(
      within(firstStepContent).getByText(/steps.step1.title/i)
    ).toBeInTheDocument()

    // Select the existing playlist option
    const useExistingPlaylistRadio = screen.getByRole("radio", {
      name: /steps.step1.form.useExistingPlaylist.title/i,
    })
    await userEvent.click(useExistingPlaylistRadio)

    // Click next
    const nextButton = screen.getByRole("button", {
      name: /steps.navigation.next/i,
    })
    await userEvent.click(nextButton)

    // Check the error message is displayed
    const playlistSelectedError = await waitFor(() => {
      return screen.getByText(/steps.errors.playlistSelected.required/i)
    })

    expect(playlistSelectedError).toBeInTheDocument()
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
    await userEvent.click(createNewPlaylistRadio)

    // Fill the playlist name
    const playlistNameInput = screen.getByLabelText(
      /steps.step1.form.createNewPlaylist.giveAName/i
    )
    await userEvent.type(playlistNameInput, "My new playlist")

    // Enable private playlist
    const privatePlaylistSwitch = screen.getByRole("switch", {
      name: /steps.step1.form.createNewPlaylist.privatePlaylist.title/i,
    })
    await userEvent.click(privatePlaylistSwitch)

    // Click next
    const nextButton = screen.getByRole("button", {
      name: /steps.navigation.next/i,
    })
    await userEvent.click(nextButton)

    // Check the second step is displayed
    const secondStepContentTitle = await waitFor(() => {
      const secondStepContent = screen.getByRole("tabpanel")
      return within(secondStepContent).getByText(/steps.step2.title/i)
    })

    expect(secondStepContentTitle).toBeInTheDocument()
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

    // Fill the playlist name
    const playlistNameInput = screen.getByLabelText(
      /steps.step1.form.createNewPlaylist.giveAName/i
    )
    await userEvent.type(playlistNameInput, "My new playlist")

    // Click next
    const nextButton = screen.getByRole("button", {
      name: /steps.navigation.next/i,
    })
    userEvent.click(nextButton)

    // Check the second step is displayed
    const secondStepContentTitle = await waitFor(() => {
      const secondStepContent = screen.getByRole("tabpanel")
      return within(secondStepContent).getByText(/steps.step2.title/i)
    })

    expect(secondStepContentTitle).toBeInTheDocument()

    const previousButton = screen.getByRole("button", {
      name: /steps.navigation.previous/i,
    })
    await userEvent.click(previousButton)

    await waitFor(() => {
      within(firstStepContent).getByText(/steps.step1.title/i)
    })
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

    // Fill the playlist name
    const playlistNameInput = screen.getByLabelText(
      /steps.step1.form.createNewPlaylist.giveAName/i
    )
    await userEvent.type(playlistNameInput, "My new playlist")

    // Click next
    const nextButton = screen.getByRole("button", {
      name: /steps.navigation.next/i,
    })
    userEvent.click(nextButton)

    // Check the second step is displayed
    const secondStepContentTitle = await waitFor(() => {
      const secondStepContent = screen.getByRole("tabpanel")
      return within(secondStepContent).getByText(/steps.step2.title/i)
    })

    expect(secondStepContentTitle).toBeInTheDocument()

    // Fill the form
    const searchInput = screen.getByPlaceholderText(
      "steps.step2.searchPlaceholder"
    )
    await userEvent.type(searchInput, "Holding")

    const itemOption = screen.getByRole("option", {
      name: /Holding Absence/i,
    })
    await userEvent.click(itemOption)

    // Check the selected item is displayed
    const selectedItem = screen.getByText(/Holding Absence/i)
    expect(selectedItem).toBeInTheDocument()

    // Click next
    const generateButton = screen.getByRole("button", {
      name: /steps.navigation.generate/i,
    })
    await userEvent.click(generateButton)

    // Check the third step is displayed
    const thirdStepContentTitle = await waitFor(() => {
      const thirdStepContent = screen.getByRole("tabpanel")
      return within(thirdStepContent).getByText(/steps.step3.title/i)
    })

    expect(thirdStepContentTitle).toBeInTheDocument()

    // Check the last step content is displayed
    const successfullyMessage = screen.getByText(
      /steps.step3.playlisyGeneratedSuccessfully/i
    )
    expect(successfullyMessage).toBeInTheDocument()

    const copyURLButton = screen.getByRole("button", {
      name: /steps.step3.copyButton/i,
    })
    expect(copyURLButton).toBeInTheDocument()
  })
})
