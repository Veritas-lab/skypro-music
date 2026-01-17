import "@testing-library/jest-dom";

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "",
}));

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

beforeEach(() => {
  localStorageMock.clear();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});
