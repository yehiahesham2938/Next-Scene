const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [path.resolve(__dirname, 'jest.setup.js')],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': path.resolve(__dirname, '__mocks__/fileMock.js'),
  },
  rootDir: path.resolve(__dirname, '../../'),
  roots: ['<rootDir>/tests', '<rootDir>/frontend/react/src'],
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,jsx}',
    '<rootDir>/frontend/react/src/**/*.test.{js,jsx}',
  ],
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: path.resolve(__dirname, 'babel.config.cjs') }],
  },
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: ['node_modules', path.resolve(__dirname, 'node_modules')],
  collectCoverageFrom: [
    'frontend/react/src/**/*.{js,jsx}',
    '!frontend/react/src/main.jsx',
  ],
};
