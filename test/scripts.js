const path = require('path');
const execa = require('execa');
const terminate = require('terminate');
const { promisify } = require('util');
const { waitForPort, waitForStdout } = require('./utils');

const terminateAsync = promisify(terminate);
const isCI = !!process.env.WITH_PUBLISH;

const defaultOptions = {
  BROWSER: 'none',
};

const yoshiBin = require.resolve('../packages/yoshi/bin/yoshi-cli');

module.exports = class Scripts {
  constructor({ silent = false, testDirectory }) {
    this.silent = silent;
    this.testDirectory = testDirectory;
    this.serverProcessPort = 3000;
    this.staticsServerPort = 3200;
    this.yoshiCIDir = isCI
      ? `${global.testDirectory}/node_modules`
      : path.join(__dirname, '../packages/yoshi-flow-legacy/node_modules');
  }

  async startWithCallback(callback = () => {}) {
    const startProcess = execa(
      'node',
      [yoshiBin, 'start', '--server', 'dist/server.js'],
      {
        cwd: this.testDirectory,
        //stdio: 'inherit',
        env: {
          PORT: this.serverProcessPort,
          NODE_PATH: this.yoshiCIDir,
          ...defaultOptions,
        },
      },
    );

    // `startProcess` will never resolve but if it fails this
    // promise will reject immediately
    await Promise.race([
      Promise.all([
        waitForPort(this.serverProcessPort, { timeout: 60 * 1000 }),
        waitForPort(this.staticsServerPort, { timeout: 60 * 1000 }),
        waitForStdout(startProcess, 'Compiled successfully!'),
      ]),
      startProcess,
    ]);

    try {
      await callback();
    } finally {
      await terminateAsync(startProcess.pid);
    }
  }

  analyze(env = {}) {
    const buildProcess = execa('node', [yoshiBin, 'build', '--analyze'], {
      cwd: this.testDirectory,
      env: {
        ...defaultOptions,
        ...env,
      },
      // stdio: 'inherit',
    });

    return {
      done() {
        return terminateAsync(buildProcess.pid);
      },
    };
  }

  async build(env = {}, args = []) {
    return execa('node', [yoshiBin, 'build', ...args], {
      cwd: this.testDirectory,
      env: {
        ...defaultOptions,
        ...env,
      },
      stdio: this.silent ? 'pipe' : 'inherit',
    });
  }

  async test(env = {}) {
    return execa('node', [yoshiBin, 'test'], {
      cwd: this.testDirectory,
      env: {
        NODE_PATH: this.yoshiCIDir,
        ...defaultOptions,
        ...env,
      },
      stdio: this.silent ? 'pipe' : 'inherit',
    });
  }

  async start(env) {
    const startProcess = execa('npx', ['yoshi', 'start'], {
      cwd: this.testDirectory,
      // stdio: 'inherit',
      env: {
        PORT: this.serverProcessPort,
        ...defaultOptions,
        ...env,
      },
    });

    // `startProcess` will never resolve but if it fails this
    // promise will reject immediately
    await Promise.race([
      Promise.all([
        waitForPort(this.serverProcessPort, { timeout: 60 * 1000 }),
        waitForPort(this.staticsServerPort, { timeout: 60 * 1000 }),
        waitForStdout(startProcess, 'Compiled successfully!'),
      ]),
      startProcess,
    ]);

    return {
      port: this.serverProcessPort,
      done() {
        return terminateAsync(startProcess.pid);
      },
    };
  }

  async serve() {
    const staticsServerProcess = execa(
      'npx',
      ['serve', '-p', this.staticsServerPort, '-s', 'dist/statics/'],
      {
        cwd: this.testDirectory,
        // stdio: 'inherit',
      },
    );

    const appServerProcess = execa('node', ['index.js'], {
      cwd: this.testDirectory,
      // stdio: 'inherit',
      env: {
        PORT: this.serverProcessPort,
      },
    });

    await Promise.all([
      waitForPort(this.staticsServerPort),
      waitForPort(this.serverProcessPort),
    ]);

    return {
      staticsServerPort: this.staticsServerPort,
      appServerProcessPort: this.serverProcessPort,
      done() {
        return Promise.all([
          terminateAsync(staticsServerProcess.pid),
          terminateAsync(appServerProcess.pid),
        ]);
      },
    };
  }
  async serveWithCallback(callback = () => {}) {
    await this.build();

    const staticsServerProcess = execa(
      'npx',
      ['serve', '-p', this.staticsServerPort, '-s', 'dist/statics/'],
      {
        cwd: this.testDirectory,
        stdio: 'inherit',
      },
    );

    const appServerProcess = execa('node', ['dist/server.js'], {
      cwd: this.testDirectory,
      // stdio: 'inherit',
      env: {
        NODE_PATH: this.yoshiCIDir,
        PORT: this.serverProcessPort,
      },
    });

    await Promise.all([
      waitForPort(this.staticsServerPort),
      waitForPort(this.serverProcessPort),
    ]);

    try {
      await callback();
    } finally {
      await Promise.all([
        terminateAsync(staticsServerProcess.pid),
        terminateAsync(appServerProcess.pid),
      ]);
    }
  }
};
