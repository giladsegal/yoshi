module.exports = {
  preset: 'jest-puppeteer',
  rootDir: './test/cases',
  testMatch: ['**/*.test.js'],
  transformIgnorePatterns: ['/node_modules/'],
};
