import path from 'path';
import globby from 'globby';
import { getProjectArtifactId } from 'yoshi-helpers/utils';
import resolve from 'resolve';

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

const defaultExtensions = ['.ts', '.js'];
function resolveFrom(dir: string, fileName: string, withTsx: boolean = false) {
  try {
    return resolve.sync(path.join(dir, fileName), {
      extensions: withTsx ? ['.tsx', ...defaultExtensions] : defaultExtensions,
    });
  } catch (error) {}
}

export async function generateFlowEditorModel(): Promise<FlowEditorModel> {
  const artifactId = getProjectArtifactId();
  if (!artifactId) {
    throw new Error(`artifact id not provided.
    Please insert <artifactId>yourArtifactId</artifactId> in your "pom.xml"`);
  }

  const initApp = resolveFrom(path.join(process.cwd(), 'src'), 'app');
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

      const widgetFileName = resolveFrom(componentDirectory, 'Widget', true);
      const pageFileName = resolveFrom(componentDirectory, 'Page', true);
      const controllerFileName = resolveFrom(componentDirectory, 'controller');
      const settingsFileName = resolveFrom(
        componentDirectory,
        'Settings',
        true,
      );

      if (!controllerFileName) {
        throw new Error(`Missing controller file for the component in "${componentDirectory}".
        Please create "controller.js/ts" file in "${componentDirectory}" directory`);
      }
      if (!widgetFileName && !pageFileName) {
        throw new Error(`Missing widget or page file for the component in "${componentDirectory}".
        Please create either Widget.js/ts/tsx or Page.js/ts/tsx file in "${componentDirectory}" directory`);
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
