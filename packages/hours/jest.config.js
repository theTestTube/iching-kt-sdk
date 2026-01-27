/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/', '/flows/', '\\.maestro\\.yaml$'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@iching-kt|react-native-web)/)',
  ],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^@iching-kt/core$': '<rootDir>/../core/src',
    '^@iching-kt/provider-time$': '<rootDir>/../provider-time/src',
    '^@iching-kt/data-hexagrams$': '<rootDir>/../data-hexagrams/src',
  },
};
