import path from 'path';
import globby from 'globby';
import { getProjectArtifactId } from 'yoshi-helpers/utils';

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
  settingsFileName: string | null;
  id: string;
}

function resolveIfExists(filePath: string) {
  try {
    return require.resolve(filePath);
  } catch (error) {
    return null;
  }
}

export async function generateFlowEditorModel(): Promise<FlowEditorModel> {
  const artifactId = getProjectArtifactId();

  const componentsDirectories = await globby('./src/components/*', {
    onlyDirectories: true,
    absolute: true,
  });

  const componentsModel: Array<ComponentModel> = componentsDirectories.map(
    componentDirectory => {
      const componentName = path.basename(componentDirectory);

      const checkIfExists = (filePath: string) => {
        return resolveIfExists(path.join(componentDirectory, filePath));
      };

      const widgetFileName = checkIfExists('Widget');
      const pageFileName = checkIfExists('Page');
      const controllerFileName = checkIfExists('controller');
      const settingsFileName = checkIfExists('Settings');

      if (!controllerFileName) {
        throw new Error(`Missing controller file for the component in "${componentDirectory}".
        Please create "controller.js/ts" file in "${path.dirname(
          componentDirectory,
        )}" directory`);
      }
      if (!widgetFileName && !pageFileName) {
        throw new Error(`Missing widget or page file for the component in "${componentDirectory}".
        Please create either Widget.js/ts or Page.js/ts file in "${path.dirname(
          componentDirectory,
        )}" directory`);
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

  const [initApp] = await globby('./src/components/initApp.js', {
    absolute: true,
  });

  if (!artifactId) {
    throw new Error(`artifact id not provided.
    Please insert <artifactId>yourArtifactId</artifactId> in your "pom.xml"`);
  }

  return {
    // TODO: import from named export
    appDefId: '',
    artifactId,
    initApp,
    components: componentsModel,
  };
}
