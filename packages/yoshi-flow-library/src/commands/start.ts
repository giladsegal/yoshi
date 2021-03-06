import path from 'path';
import arg from 'arg';
import fs from 'fs-extra';
import DevEnvironment from 'yoshi-common/build/dev-environment';
import { TARGET_DIR, STATICS_DIR } from 'yoshi-config/build/paths';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';
import * as telemetry from 'yoshi-common/build/telemetry';
import { cliCommand } from '../cli';

import { createClientWebpackConfig } from '../webpack.config';

const join = (...dirs: Array<string>) => path.join(process.cwd(), ...dirs);

const start: cliCommand = async function (argv, config, pkgJson) {
  telemetry.startInit('Library', pkgJson.name!);

  const args = arg(
    {
      // Types
      '--help': Boolean,
      '--production': Boolean,
    },
    { argv },
  );

  const { '--help': help, '--production': shouldRunAsProduction } = args;

  if (help) {
    console.log(
      `
      Description
        Start a development server which rebuilds on any change

      Usage
        $ yoshi-library start

      Options
        --help, -h      Displays this message
        --production    Start using unminified production build
    `,
    );

    process.exit(0);
  }

  if (shouldRunAsProduction) {
    process.env.BABEL_ENV = 'production';
    process.env.NODE_ENV = 'production';
  }

  await Promise.all([
    fs.emptyDir(join(STATICS_DIR)),
    fs.emptyDir(join(TARGET_DIR)),
  ]);

  const webpackConfigs = [];

  if (config.bundleConfig) {
    const clientConfig = createClientWebpackConfig(config, {
      isDev: true,
      isHot: false,
    });

    webpackConfigs.push(clientConfig);
  }

  // In case of a node libaray we don't want to emit the ESM directory
  const emitDeclarationOnly = config.target === 'node';

  const devEnvironment = await DevEnvironment.create({
    webpackConfigs: webpackConfigs as [webpack.Configuration?],
    // @ts-ignore - we won't need this port if we won't have clientConfig
    webpackDevServerPort: config.bundleConfig?.port,
    https: false,
    appName: config.pkgJson.name!,
    enableClientHotUpdates: false,
    compileTypeScriptFiles: true,
    emitDeclarationOnly,
    storybook: config.storybook,
  });

  await devEnvironment.start();
};

export default start;
