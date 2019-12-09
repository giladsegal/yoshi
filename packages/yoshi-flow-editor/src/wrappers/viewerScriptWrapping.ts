import path from 'path';
import fs from 'fs-extra';
import { FlowEditorModel, ComponentModel } from '../model';

const viewerScriptWrapperPath =
  'yoshi-flow-editor-runtime/build/viewerScript.js';

const viewerScriptWrapper = (
  generatedWidgetEntriesPath: string,
  model: FlowEditorModel,
) => {
  return model.components.reduce(
    (acc: Record<string, string>, component: ComponentModel) => {
      const generatedWidgetEntryPath = path.join(
        generatedWidgetEntriesPath,
        `${component.name}ViewerScript.js`,
      );

      const generateControllerEntryContent = `
    import {createControllers as createControllersWrapper, initAppForPage as initAppForPageWrapper} from '${viewerScriptWrapperPath}';
    import userController from '${component.controllerFileName}';
    import userInitApp from '${model.initApp}';

    export const initAppForPage = initAppForPageWrapper;
    export const createControllers = createControllersWrapper(userController, userInitApp);`;

      fs.outputFileSync(
        generatedWidgetEntryPath,
        generateControllerEntryContent,
      );

      acc[`${component.name}ViewerScript`] = generatedWidgetEntryPath;
      acc[`${component.name}Controller`] = component.controllerFileName;

      return acc;
    },
    {},
  );
};

export default viewerScriptWrapper;
