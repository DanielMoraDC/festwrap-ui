import { useState } from "react"

type UseCopyToClipboardReturn = {
  copy: (_text: string) => void
  isCopied: boolean
}

const DELAY_TIME = 1000

export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [isCopied, setIsCopied] = useState(false)

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), DELAY_TIME)
    } catch (error) {
      console.error("Failed to copy text to clipboard", error)
      setIsCopied(false)
    }
  }

  return { copy, isCopied }
}
