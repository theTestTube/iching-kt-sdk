/** @type {import('jest').Config} */
module.exports = {
  projects: [
    '<rootDir>/packages/core',
    '<rootDir>/packages/hours',
  ],
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx}',
    '!packages/*/src/**/*.test.{ts,tsx}',
    '!packages/*/src/index.ts',
  ],
};
