/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: ['**/src/__tests__/**/*.test.{ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@iching-kt|react-native-web)/)',
  ],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^@iching-kt/core$': '<rootDir>/packages/core/src',
    '^@iching-kt/provider-time$': '<rootDir>/packages/provider-time/src',
    '^@iching-kt/data-hexagrams$': '<rootDir>/packages/data-hexagrams/src',
    '^@iching-kt/hours$': '<rootDir>/packages/hours/src',
  },
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx}',
    '!packages/*/src/**/*.test.{ts,tsx}',
    '!packages/*/src/index.ts',
  ],
};
