import React from 'react';
import { ViewerScriptWrapper } from '@wix/native-components-infra';
import WidgetWrapper from './WidgetWrapper';
import { createControllers, initAppForPage } from './viewerScript.js';

// TODO: fill overrides and whatnot from santawrapper
const EditorAppWrapper = (
  UserComponent: typeof React.Component,
  userController: Function,
  initApp: Function,
) =>
  ViewerScriptWrapper(WidgetWrapper(UserComponent), {
    viewerScript: {
      createControllers: createControllers(userController, initApp),
      initAppForPage,
    },
    Wix: window.Wix,
    widgetConfig: {
      widgetId: '',
      getAllPublicData: true,
    },
    // overrides: {
    //   fedopsAppName: CART_ICON_APP_NAME,
    //   fedopsLogger,
    //   locale: window.__LOCALE__,
    //   siteBaseUrl: `${window.__APP_MODEL__.topology.baseDomain}/`,
    //   platform: {baseUrls: {cartIconBaseUrl: window.__BASE_STATIC_URL__}},
    // },
  });

export default EditorAppWrapper;
