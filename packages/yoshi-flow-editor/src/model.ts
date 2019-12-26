import path from 'path';
import globby from 'globby';
import { getProjectArtifactId } from 'yoshi-helpers/utils';
import resolveFrom from 'resolve-from';

export interface FlowEditorModel {
  appDefId: string;
  artifactId: string;
  initApp: string;
  components: Array<ComponentModel>;
}

type ComponentType = 'widget' | 'page';

export interface ComponentModel {
  name: string;
  type: ComponentType;
  fileName: string;
  controllerFileName: string;
  settingsFileName?: string;
  id: string;
}

export async function generateFlowEditorModel(): Promise<FlowEditorModel> {
  const artifactId = getProjectArtifactId();
  if (!artifactId) {
    throw new Error(`artifact id not provided.
    Please insert <artifactId>yourArtifactId</artifactId> in your "pom.xml"`);
  }

  const initApp = resolveFrom.silent('src', './app');
  if (!initApp) {
    throw new Error(`Missing app file.
    Please create "app.js/ts" file in "${path.resolve('./src')}" directory`);
  }

  const componentsDirectories = await globby('./src/components/*', {
    onlyDirectories: true,
    absolute: true,
  });

  const componentsModel: Array<ComponentModel> = componentsDirectories.map(
    componentDirectory => {
      const componentName = path.basename(componentDirectory);
      const resovleFromComponentDir = resolveFrom.silent.bind(
        null,
        componentDirectory,
      );

      const widgetFileName = resovleFromComponentDir('./Widget');
      const pageFileName = resovleFromComponentDir('./Page');
      const controllerFileName = resovleFromComponentDir('./controller');
      const settingsFileName = resovleFromComponentDir('./Settings');

      if (!controllerFileName) {
        throw new Error(`Missing controller file for the component in "${componentDirectory}".
        Please create "controller.js/ts" file in "${componentDirectory}" directory`);
      }
      if (!widgetFileName && !pageFileName) {
        throw new Error(`Missing widget or page file for the component in "${componentDirectory}".
        Please create either Widget.js/ts or Page.js/ts file in "${componentDirectory}" directory`);
      }

      return {
        name: componentName,
        fileName: (widgetFileName || pageFileName) as string,
        type: widgetFileName ? 'widget' : 'page',
        controllerFileName,
        settingsFileName,
        // TODO: import from named export
        id: '',
      };
    },
  );

  return {
    // TODO: import from named export
    appDefId: '',
    artifactId,
    initApp,
    components: componentsModel,
  };
}
