import http from 'http';
import https from 'https';
import path from 'path';
import cors from 'cors';
import OriginalWebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import { STATICS_DIR } from 'yoshi-config/paths';
import express from 'express';
import { createDevServerSocket as createDevServerTunnelSocket } from './utils/suricate';

export function redirectMiddleware(
  hostname: string,
  port: number,
): express.Handler {
  return (req, res, next) => {
    if (!/\.min\.(js|css)/.test(req.originalUrl)) {
      return next();
    }

    const httpModule = req.protocol === 'http' ? http : https;

    const options = {
      port,
      hostname,
      path: req.originalUrl.replace('.min', ''),
      rejectUnauthorized: false,
    };

    const request = httpModule.request(options, proxiedResponse => {
      for (const header in proxiedResponse.headers) {
        // @ts-ignore
        res.setHeader(header, proxiedResponse.headers[header]);
      }
      proxiedResponse.pipe(res);
    });

    request.on('error', () => next()).end();
  };
}

// The server should be accessible externally
export const host = '0.0.0.0';

export class WebpackDevServer extends OriginalWebpackDevServer {
  public port: number;
  public https: boolean;
  public compiler: webpack.Compiler;
  public suricate: boolean;
  public appName: string;

  constructor(
    compiler: webpack.Compiler,
    {
      publicPath,
      https,
      port,
      suricate,
      appName,
      cwd = process.cwd(),
    }: {
      publicPath: string;
      https: boolean;
      port: number;
      suricate: boolean;
      appName: string;
      cwd?: string;
    },
  ) {
    super(compiler, {
      // Enable gzip compression for everything served
      compress: true,
      clientLogLevel: 'error',
      contentBase: path.join(cwd, STATICS_DIR),
      watchContentBase: true,
      hot: true,
      publicPath,
      writeToDisk: true,
      // We write our own errors/warnings to the console
      quiet: true,
      noInfo: true,
      https,
      host,
      overlay: true,
      // https://github.com/wix/yoshi/pull/1191
      allowedHosts: [
        '.wix.com',
        '.wixsite.com',
        '.ooidev.com',
        '.deviantart.lan',
      ],
      disableHostCheck: true,
      before(expressApp) {
        // Send cross origin headers
        // TODO - support only suricate URL
        expressApp.use(
          cors({
            origin: (requestOrigin, cb) => cb(null, true),
            credentials: true,
          }),
        );
        // Redirect `.min.(js|css)` to `.(js|css)`
        expressApp.use(redirectMiddleware(host, port));
      },
    });

    this.port = port;
    this.https = https;
    this.compiler = compiler;
    this.appName = appName;
    this.suricate = suricate;
  }

  // Update sockets with new stats, we use the sockWrite() method
  // to update the hot client with server data
  send(type: string, data: any) {
    // @ts-ignore
    return this.sockWrite(this.sockets, type, data);
  }

  listenPromise() {
    const listenTarget = this.suricate
      ? createDevServerTunnelSocket(this.appName, this.port)
      : this.port;

    return new Promise((resolve, reject) => {
      super.listen(listenTarget, host, err => (err ? reject(err) : resolve()));
    });
  }
}
