import { cleanup, render, screen } from "@testing-library/react"
import { useSession } from "next-auth/react"
import Header from "./Header"
import { vi, describe, afterEach, beforeAll, test, expect } from "vitest"

vi.mock("next-auth/react", () => {
  return {
    __esModule: true,
    useSession: vi.fn(),
  }
})

const writeTextMock = vi.fn()

Object.assign(navigator, {
  clipboard: {
    writeText: writeTextMock,
  },
})

vi.mock("@/components/ui/DropdownMenu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => <button onClick={onClick}>{children}</button>,
}))

describe("Header", () => {
  const TOMORRROW_DATE = new Date(Date.now() + 86400).toISOString()

  afterEach(() => {
    vi.clearAllMocks()
    cleanup()
  })

  beforeAll(() => {
    window.PointerEvent = MouseEvent as typeof PointerEvent
  })

  test("should render header", () => {
    vi.mocked(useSession).mockReturnValue({
      update: vi.fn(),
      data: null,
      status: "unauthenticated",
    })

    render(<Header />)

    // check navlinks
    expect(
      screen.getByRole("link", { name: /Get started/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /How does it works\?/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /About us/i })).toBeInTheDocument()
  })

  test("should render sign in button when there is not session", () => {
    vi.mocked(useSession).mockReturnValue({
      update: vi.fn(),
      data: null,
      status: "unauthenticated",
    })

    render(<Header />)

    expect(
      screen.getByRole("button", { name: /Login with Spotify/i })
    ).toBeTruthy()
  })

  test("should render sign out button when there is session", async () => {
    const mockSession = {
      expires: TOMORRROW_DATE,
      user: {
        name: "Peter Griffin",
        email: "user@gmail.com",
        accessToken: "token",
      },
    }

    vi.mocked(useSession).mockReturnValue({
      update: vi.fn(),
      data: mockSession,
      status: "authenticated",
    })

    render(<Header />)

    const avatarButton = screen.getByRole("button", { name: /PG/i })
    expect(avatarButton).toBeInTheDocument()

    expect(screen.getByText("Log out")).toBeInTheDocument()
    expect(screen.getByText("Copy access token")).toBeInTheDocument()
  })

  test("should copy access token to clipboard", () => {
    const mockSession = {
      expires: TOMORRROW_DATE,
      user: {
        name: "Peter Griffin",
        email: "user@gmail.com",
        accessToken: "token",
      },
    }

    vi.mocked(useSession).mockReturnValue({
      update: vi.fn(),
      data: mockSession,
      status: "authenticated",
    })

    render(<Header />)

    const copyButton = screen.getByRole("button", {
      name: /Copy access token/i,
    })

    copyButton.click()

    expect(writeTextMock).toHaveBeenCalledWith(mockSession.user.accessToken)
  })
})
