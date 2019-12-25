const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const fs = require('fs-extra');
const tempy = require('tempy');
const {
  publishMonorepo,
  authenticateToRegistry,
} = require('../../scripts/utils/publishMonorepo');
const { setup: setupPuppeteer } = require('jest-environment-puppeteer');

module.exports = async globalConfig => {
  await setupPuppeteer(globalConfig);
  const isCI = !!process.env.WITH_PUBLISH;
  if (isCI) {
    global.teardown = publishMonorepo();
    const tempDir = tempy.directory();
    global.testDirectory = path.join(tempDir, 'project');
    const yoshiCIDir = path.join(__dirname, '../yoshiCIDir');
    await fs.copy(yoshiCIDir, global.testDirectory);

    console.log(
      `Running ${chalk.magenta(
        'npm install',
      )}, that might take a few minutes... ⌛ \n`,
    );

    authenticateToRegistry(global.testDirectory);
    await execa('npm install', {
      cwd: global.testDirectory,
      shell: true,
      stdio: 'inherit',
      extendEnv: false,
      env: {
        PATH: process.env.PATH,
      },
    });
  }
};
