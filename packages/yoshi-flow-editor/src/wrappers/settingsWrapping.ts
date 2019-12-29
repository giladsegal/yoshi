import path from 'path';
import fs from 'fs-extra';
import { FlowEditorModel, ComponentModel } from '../model';

const settingsWrapperPath =
  'yoshi-flow-editor-runtime/build/SettingsWrapper.js';

const settingsWrapper = (
  generatedWidgetEntriesPath: string,
  model: FlowEditorModel,
) => {
  return model.components.reduce(
    (acc: Record<string, string>, component: ComponentModel) => {
      if (component.settingsFileName) {
        const generatedWidgetEntryPath = path.join(
          generatedWidgetEntriesPath,
          `${component.name}Settings.js`,
        );

        const generateSettingsEntryContent = `
      import React from 'react';
      import ReactDOM from 'react-dom';
      import SettingsWrapper from '${settingsWrapperPath}';
      import Settings from '${component.settingsFileName}';

      ReactDOM.render(React.createElement(SettingsWrapper, null, React.createElement(Settings)), document.getElementById('root'));`;

        fs.outputFileSync(
          generatedWidgetEntryPath,
          generateSettingsEntryContent,
        );

        acc[`${component.name}SettingsPanel`] = generatedWidgetEntryPath;
      }

      return acc;
    },
    {},
  );
};

export default settingsWrapper;
