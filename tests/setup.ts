import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock window APIs needed for jsdom and user-event
if (typeof window !== "undefined") {
  // Ensure window is properly set up for jsdom
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Ensure navigator is available for user-event
  if (!window.navigator) {
    Object.defineProperty(window, "navigator", {
      writable: true,
      value: {
        clipboard: {
          writeText: vi.fn(),
          readText: vi.fn(),
        },
      },
    });
  }
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});

