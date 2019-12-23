import path from 'path';
import fs from 'fs-extra';
import { FlowEditorModel } from './model';

const editorAppWrapperPath =
  'yoshi-flow-editor-runtime/build/EditorAppWrapper.js';

const componentWrapper = (
  generatedWidgetEntriesPath: string,
  model: FlowEditorModel,
) => {
  return model.components.reduce(
    (
      acc: Record<string, string>,
      component: FlowEditorModel['components'][0],
    ) => {
      const generatedWidgetEntryPath = path.join(
        generatedWidgetEntriesPath,
        `${component.name}EditorApp.js`,
      );

      const generateWidgetEntryContent = `
    import React from 'react';
    import ReactDOM from 'react-dom';
    import EditorAppWrapper from '${editorAppWrapperPath}';

    import Component from '${component.component}';
    import createController from '${component.controller}';
    import initApp from '${model.initApp}';

    const EditorApp = EditorAppWrapper(Component, createController, initApp);

    ReactDOM.render(React.createElement(EditorApp, null), document.getElementById('root'));`;

      fs.outputFileSync(generatedWidgetEntryPath, generateWidgetEntryContent);

      acc[`${component.name}EditorMode`] = generatedWidgetEntryPath;

      return acc;
    },
    {},
  );
};

export default componentWrapper;
