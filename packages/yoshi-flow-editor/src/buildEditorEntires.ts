import path from 'path';
import writeComponentWrapping from './wrappers/componentWrapping';
import writeEditorAppWrapping from './wrappers/editorAppWrapping';
import writeSettingsWrapping from './wrappers/settingsWrapping';
import writeViewerScriptWrapping from './wrappers/viewerScriptWrapping';
import wixPrivateMockWrapping from './wrappers/wixPrivateMockWrapping';
import { FlowEditorModel } from './model';

const generatedWidgetEntriesPath = path.resolve(__dirname, '../tmp/components');

export const buildEditorPlatformEntries = (model: FlowEditorModel) => {
  const componentEntries = writeComponentWrapping(
    generatedWidgetEntriesPath,
    model,
  );
  const editorAppEntries = writeEditorAppWrapping(
    generatedWidgetEntriesPath,
    model,
  );
  const settingsEntries = writeSettingsWrapping(
    generatedWidgetEntriesPath,
    model,
  );

  const wixPrivateMockEntry = wixPrivateMockWrapping();

  return {
    ...wixPrivateMockEntry,
    ...componentEntries,
    ...editorAppEntries,
    ...settingsEntries,
  };
};

export const buildViewerScriptEntry = (model: FlowEditorModel) => {
  return writeViewerScriptWrapping(generatedWidgetEntriesPath, model);
};

export const webWorkerExternals = {
  lodash: {
    commonjs: 'lodash',
    amd: 'lodash',
    root: '_',
  },
};
