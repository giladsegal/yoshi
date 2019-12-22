import chalk from 'chalk';
import { State } from './dev-environment';
import { getUrl, getDevServerUrl } from './utils/suricate';

// TODO - add suricate print
export default (state: State) => {
  switch (state.status) {
    case 'compiling':
      console.log('Compiling...');
      break;

    case 'success':
      console.log(chalk.green('Compiled successfully!'));

      console.log();
      console.log(
        `Your server is starting and should be accessible from your browser.`,
      );
      console.log();

      console.log(getUrl(state.appName));
      console.log(getDevServerUrl(state.appName));

      console.log(
        `  ${chalk.bold('Local:')}            ${
          state.serverUrls.localUrlForTerminal
        }`,
      );
      console.log(
        `  ${chalk.bold('On Your Network:')}  ${
          state.serverUrls.lanUrlForTerminal
        }`,
      );

      console.log();
      console.log(
        `Your bundles and other static assets are served from your ${chalk.bold(
          'dev-server',
        )}.`,
      );
      console.log();

      console.log(
        `  ${chalk.bold('Local:')}            ${
          state.devServerUrls.localUrlForTerminal
        }`,
      );
      console.log(
        `  ${chalk.bold('On Your Network:')}  ${
          state.devServerUrls.lanUrlForTerminal
        }`,
      );

      console.log();
      console.log('Note that the development build is not optimized.');
      console.log(
        `To create a production build, use ` +
          `${chalk.cyan('npm run build')}.`,
      );
      console.log();
      break;

    case 'errors':
      console.log(chalk.red('Failed to compile.\n'));
      console.log(state.errors.join('\n\n'));
      break;

    case 'warnings':
      console.log(chalk.yellow('Compiled with warnings.\n'));
      console.log(state.warnings.join('\n\n'));
      break;
  }
};
