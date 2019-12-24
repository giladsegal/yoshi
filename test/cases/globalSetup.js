const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const {
  publishMonorepo,
  authenticateToRegistry,
} = require('../../scripts/utils/publishMonorepo');
const { setup: setupPuppeteer } = require('jest-environment-puppeteer');

module.exports = async globalConfig => {
  await setupPuppeteer(globalConfig);
  const isCI = !!process.env.TEAMCITY_VERSION;
  if (isCI) {
    publishMonorepo();
    const yoshiCIDir = path.join(__dirname, '../yoshiCIDir');

    console.log(
      `Running ${chalk.magenta(
        'npm install',
      )}, that might take a few minutes... ⌛ \n`,
    );

    authenticateToRegistry(yoshiCIDir);
    await execa('npm install', {
      cwd: yoshiCIDir,
      shell: true,
      stdio: 'inherit',
      extendEnv: false,
      env: {
        PATH: process.env.PATH,
      },
    });
  }
};
