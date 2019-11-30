const { globalSetup } = require('@wix/santa-site-renderer-testkit');

module.exports = (globalConfig: any) =>
  globalSetup(globalConfig, { reactSource: 'GA' });
