module.exports = {
  preset: 'jest-puppeteer',
  rootDir: './test/cases',
  testMatch: ['**/*.test.js'],
  globalSetup: require.resolve('./test/cases/globalSetup'),
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: [require.resolve('./jest-setup')],
};
