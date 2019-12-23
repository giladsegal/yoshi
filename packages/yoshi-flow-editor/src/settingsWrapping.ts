import path from 'path';
import fs from 'fs-extra';
import { FlowEditorModel } from './model';

const settingsWrapperPath =
  'yoshi-flow-editor-runtime/build/SettingsWrapper.js';

const settingsWrapper = (
  generatedWidgetEntriesPath: string,
  model: FlowEditorModel,
) => {
  return model.settings.reduce(
    (acc: Record<string, any>, setting: FlowEditorModel['settings'][0]) => {
      const generatedWidgetEntryPath = path.join(
        generatedWidgetEntriesPath,
        `${setting.name}Settings.js`,
      );

      const generateSettingsEntryContent = `
    import React from 'react';
    import ReactDOM from 'react-dom';
    import SettingsWrapper from '${settingsWrapperPath}';
    import Settings from '${setting.path}';

    ReactDOM.render(React.createElement(SettingsWrapper, null, React.createElement(Settings)), document.getElementById('root'));`;

      fs.outputFileSync(generatedWidgetEntryPath, generateSettingsEntryContent);

      acc[`${setting.name}SettingsPanel`] = generatedWidgetEntryPath;

      return acc;
    },
    {},
  );
};

export default settingsWrapper;
