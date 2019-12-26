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
  const isPublish = !!process.env.WITH_PUBLISH;
  if (isPublish) {
    global.teardown = publishMonorepo();
    const tempDir = tempy.directory();
    global.testDirectory = path.join(tempDir, 'project');
    const yoshiPublishDir = path.join(__dirname, './yoshi-publish');
    await fs.copy(yoshiPublishDir, global.testDirectory);

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
