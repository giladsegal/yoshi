module.exports = {
  preset: 'jest-puppeteer',
  rootDir: './test/cases-typescript',
  testMatch: ['**/*.test.js'],
  globalSetup: require.resolve('./test/cases-typescript/globalSetup'),
  globalTeardown: require.resolve('./test/cases-typescript/globalTeardown'),
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: [require.resolve('./jest-setup')],
};
