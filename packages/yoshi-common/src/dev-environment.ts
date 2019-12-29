import webpack from 'webpack';
import createStore, { Store } from 'unistore';
import clearConsole from 'react-dev-utils/clearConsole';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import { prepareUrls, Urls } from 'react-dev-utils/WebpackDevServerUtils';
import openBrowser from './open-browser';
import { PORT } from './utils/constants';
import ServerProcess from './server-process';
import { WebpackDevServer, host } from './webpack-dev-server';
import { addEntry, createCompiler } from './webpack-utils';
import { isTruthy } from './utils/helpers';
import {
  getUrl as getTunnelUrl,
  getDevServerSocketPath,
} from './utils/suricate';

import devEnvironmentLogger from './dev-environment-logger';

const isInteractive = process.stdout.isTTY;

type WebpackStatus = {
  errors: Array<string>;
  warnings: Array<string>;
};

type StartUrl = string | Array<string> | null | undefined;

export type State =
  | {
      status: 'compiling';
    }
  | ({
      status: 'success';
      serverUrls: Urls;
      devServerUrls: Urls;
      appName: string;
    } & WebpackStatus)
  | ({ status: 'errors' } & WebpackStatus)
  | ({ status: 'warnings' } & WebpackStatus);

export default class DevEnvironment {
  private webpackDevServer: WebpackDevServer;
  private serverProcess: ServerProcess;
  public store: Store<State>;
  private multiCompiler: webpack.MultiCompiler;
  private startUrl: StartUrl;
  private suricate: boolean;
  private appName: string;

  constructor(
    webpackDevServer: WebpackDevServer,
    serverProcess: ServerProcess,
    multiCompiler: webpack.MultiCompiler,
    appName: string,
    suricate: boolean = false,
    startUrl?: StartUrl,
  ) {
    this.webpackDevServer = webpackDevServer;
    this.serverProcess = serverProcess;
    this.multiCompiler = multiCompiler;
    this.startUrl = startUrl;
    this.appName = appName;
    this.suricate = suricate;

    this.store = createStore<State>();

    this.multiCompiler.hooks.invalid.tap('recompile-log', () => {
      if (isInteractive) {
        clearConsole();
      }

      this.store.setState({
        status: 'compiling',
      });
    });

    this.multiCompiler.hooks.done.tap('finished-log', stats => {
      if (isInteractive) {
        clearConsole();
      }

      // @ts-ignore
      const messages = formatWebpackMessages(stats.toJson({}, true));
      const isSuccessful = !messages.errors.length && !messages.warnings.length;

      if (isSuccessful) {
        const serverUrls = prepareUrls('http', host, PORT);

        const devServerUrls = prepareUrls(
          this.webpackDevServer.https ? 'https' : 'http',
          host,
          this.webpackDevServer.port,
        );

        this.store.setState({
          status: 'success',
          appName: this.webpackDevServer.appName,
          serverUrls,
          devServerUrls,
          ...messages,
        } as State);
      } else if (messages.errors.length) {
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }

        this.store.setState({
          status: 'errors',
          ...messages,
        });
      } else if (messages.warnings.length) {
        this.store.setState({
          status: 'warnings',
          ...messages,
        });
      }
    });
  }

  private async triggerBrowserRefresh(jsonStats: webpack.Stats.ToJsonOutput) {
    await this.webpackDevServer.send('hash', jsonStats.hash);
    await this.webpackDevServer.send('ok', {});
  }

  private async showErrorsOnBrowser(jsonStats: webpack.Stats.ToJsonOutput) {
    if (jsonStats.errors.length > 0) {
      await this.webpackDevServer.send('errors', jsonStats.errors);
    } else if (jsonStats.warnings.length > 0) {
      await this.webpackDevServer.send('warnings', jsonStats.warnings);
    }
  }

  startWebWorkerHotUpdate(compiler: webpack.Compiler) {
    compiler.watch({}, async (error, stats) => {
      // We save the result of this build to webpack-dev-server's internal state so the last
      // server build results are sent to the browser on every refresh
      //
      // https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js#L144
      // @ts-ignore
      this._stats = stats;

      const jsonStats = stats.toJson();

      if (!error && !stats.hasErrors()) {
        await this.triggerBrowserRefresh(jsonStats);
      } else {
        await this.showErrorsOnBrowser(jsonStats);
      }
    });
  }

  startServerHotUpdate(compiler: webpack.Compiler) {
    compiler.watch({}, async (error, stats) => {
      // We save the result of this build to webpack-dev-server's internal state so the last
      // server build results are sent to the browser on every refresh
      //
      // https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js#L144
      // @ts-ignore
      this._stats = stats;

      const jsonStats = stats.toJson();

      // If the spawned server process has died, restart it
      if (
        this.serverProcess.child &&
        // @ts-ignore
        this.serverProcess.child.exitCode !== null
      ) {
        await this.serverProcess.restart();
        await this.triggerBrowserRefresh(jsonStats);
      }
      // If it's alive, send it a message to trigger HMR
      else {
        // If there are no errors and the server can be refreshed
        // then send it a signal and wait for a responsne
        if (this.serverProcess.child && !error && !stats.hasErrors()) {
          const { success } = (await this.serverProcess.send({})) as {
            success: boolean;
          };

          // HMR wasn't successful, restart the server process
          if (!success) {
            await this.serverProcess.restart();
          }

          await this.triggerBrowserRefresh(jsonStats);
        } else {
          await this.showErrorsOnBrowser(jsonStats);
        }
      }
    });
  }

  async start() {
    const compilationPromise = new Promise(resolve => {
      this.multiCompiler.hooks.done.tap('done', resolve);
    });

    // Start Webpack compilation
    await this.webpackDevServer.listenPromise();
    await compilationPromise;

    await this.serverProcess.initialize();

    const startUrl = this.suricate
      ? getTunnelUrl(this.appName)
      : this.startUrl || 'http://localhost:3000';

    openBrowser(startUrl);
  }

  static async create({
    webpackConfigs,
    serverFilePath,
    https,
    webpackDevServerPort,
    enableClientHotUpdates,
    cwd = process.cwd(),
    appName,
    startUrl,
    suricate = false,
  }: {
    webpackConfigs: [
      webpack.Configuration,
      webpack.Configuration,
      webpack.Configuration?,
    ];
    serverFilePath: string;
    https: boolean;
    webpackDevServerPort: number;
    enableClientHotUpdates: boolean;
    cwd?: string;
    appName: string;
    startUrl?: StartUrl;
    suricate?: boolean;
  }): Promise<DevEnvironment> {
    const [clientConfig, serverConfig] = webpackConfigs;

    const publicPath = clientConfig.output!.publicPath!;

    const serverProcess = await ServerProcess.create({
      serverFilePath,
      cwd,
      suricate,
      appName,
    });

    // Add client hot entries
    if (enableClientHotUpdates) {
      if (!clientConfig.entry) {
        throw new Error('client webpack config was created without an entry');
      }

      const socketForHmr = suricate
        ? getDevServerSocketPath(appName)
        : publicPath;

      clientConfig.entry = addEntry(clientConfig.entry, [
        require.resolve('webpack/hot/dev-server'),
        // Adding the query param with the CDN URL allows HMR when working with a production site
        // because the bundle is requested from "parastorage" we need to specify to open the socket to localhost
        `${require.resolve('webpack-dev-server/client')}?${socketForHmr}`,
      ]);
    }

    if (!serverConfig.entry) {
      throw new Error('server webpack config was created without an entry');
    }

    // Add server hot entry
    serverConfig.entry = addEntry(serverConfig.entry, [
      `${require.resolve('./utils/server-hot-client')}?${
        serverProcess.socketServer.hmrPort
      }`,
    ]);

    const multiCompiler = createCompiler(webpackConfigs.filter(isTruthy));

    const [
      clientCompiler,
      serverCompiler,
      webWorkerCompiler,
    ] = multiCompiler.compilers as [
      webpack.Compiler,
      webpack.Compiler,
      webpack.Compiler?,
    ];

    const webpackDevServer = new WebpackDevServer(clientCompiler, {
      publicPath,
      https,
      port: webpackDevServerPort,
      appName,
      suricate,
    });

    const devEnvironment = new DevEnvironment(
      webpackDevServer,
      serverProcess,
      multiCompiler,
      appName,
      suricate,
      startUrl,
    );

    devEnvironment.startServerHotUpdate(serverCompiler);

    if (webWorkerCompiler) {
      devEnvironment.startWebWorkerHotUpdate(webWorkerCompiler);
    }

    devEnvironment.store.subscribe(devEnvironmentLogger);

    return devEnvironment;
  }
}
