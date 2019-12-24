import path from 'path';
import writeComponentWrapping from './componentWrapping';
import writeEditorAppWrapping from './editorAppWrapping';
import writeSettingsWrapping from './settingsWrapping';
import writeViewerScriptWrapping from './viewerScriptWrapping';
import wixPrivateMockWrapping from './wixPrivateMockWrapping';
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
