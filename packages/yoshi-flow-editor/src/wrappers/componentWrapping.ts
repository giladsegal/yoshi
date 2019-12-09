import path from 'path';
import fs from 'fs-extra';
import { FlowEditorModel, ComponentModel } from '../model';

const widgetWrapperPath = 'yoshi-flow-editor-runtime/build/WidgetWrapper.js';

const componentWrapper = (
  generatedWidgetEntriesPath: string,
  model: FlowEditorModel,
) => {
  return model.components.reduce(
    (acc: Record<string, string>, component: ComponentModel) => {
      const generatedWidgetEntryPath = path.join(
        generatedWidgetEntriesPath,
        `${component.name}Component.js`,
      );

      const generateWidgetEntryContent = `
    import WidgetWrapper from '${widgetWrapperPath}';
    import Widget from '${component.fileName}';

    export default { component: WidgetWrapper(Widget)};`;

      fs.outputFileSync(generatedWidgetEntryPath, generateWidgetEntryContent);

      acc[`${component.name}ViewerWidget`] = generatedWidgetEntryPath;

      return acc;
    },
    {},
  );
};

export default componentWrapper;
