module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/data$": "<rootDir>/src/data",
    "^@/app/services/auth/authApi$": "<rootDir>/src/__mocks__/authApi.ts",
    "^@/app/services/tracks/tracksApi$": "<rootDir>/src/__mocks__/tracksApi.ts",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.test.(ts|tsx)",
    "<rootDir>/src/**/*.test.(ts|tsx)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};
