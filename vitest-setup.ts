import "@testing-library/jest-dom/vitest"
import { vi } from "vitest"

Element.prototype.scrollIntoView = vi.fn()

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = MockResizeObserver as any
