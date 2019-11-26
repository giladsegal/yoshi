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
    },
    overrides: {},
  });

export default EditorAppWrapper;
