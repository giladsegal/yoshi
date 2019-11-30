// https://github.com/wix-platform/wix-node-platform/tree/master/bootstrap/wix-bootstrap-testkit
import testkit from '@wix/wix-bootstrap-testkit';
// https://github.com/wix-platform/wix-node-platform/tree/master/config/wix-config-emitter
import configEmitter from '@wix/wix-config-emitter';

// take erb configurations from source folder, replace values/functions,
// remove the ".erb" extension and emit files inside the target folder
export const emitConfigs = () => {
  return configEmitter()
    .val('scripts_domain', 'static.parastorage.com')
    .emit();
};

// start the server as an embedded app
export const bootstrapServer = () => {
  return testkit.app('./dist/server', {
    env: process.env as any,
  });
};
