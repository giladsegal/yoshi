import path from 'path';
import componentWrapping from './componentWrapping';
import editorAppWrapping from './editorAppWrapping';
import settingsWrapping from './settingsWrapping';
import viewerScriptWrapping from './viewerScriptWrapping';
import wixPrivateMockWrapping from './wixPrivateMockWrapping';
import { FlowEditorModel } from './model';

const generatedWidgetEntriesPath = path.resolve(__dirname, '../tmp/components');

export const buildEditorPlatformEntries = (model: FlowEditorModel) => {
  const componentEntries = componentWrapping(generatedWidgetEntriesPath, model);
  const editorAppEntries = editorAppWrapping(generatedWidgetEntriesPath, model);
  const settingsEntries = settingsWrapping(generatedWidgetEntriesPath, model);

  const wixPrivateMockEntry = wixPrivateMockWrapping();

  return {
    ...wixPrivateMockEntry,
    ...componentEntries,
    ...editorAppEntries,
    ...settingsEntries,
  };
};

export const buildViewerScriptEntry = (model: FlowEditorModel) => {
  return viewerScriptWrapping(generatedWidgetEntriesPath, model);
};

export const webWorkerExternals = {
  lodash: {
    commonjs: 'lodash',
    amd: 'lodash',
    root: '_',
  },
};
