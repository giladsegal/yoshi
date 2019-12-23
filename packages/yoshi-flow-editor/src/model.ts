import path from 'path';
import globby from 'globby';
import { getProjectArtifactId } from 'yoshi-helpers/utils';

export interface FlowEditorModel {
  appDefId: string;
  artifactId: string;
  initApp: string;
  components: Array<ComponentModel>;
  settings: Array<{ path: string; name: string }>;
}

export enum COMPONENT_TYPE {
  WIDGET = 'widget',
  PAGE = 'page',
}

export interface ComponentModel {
  name: string;
  type: COMPONENT_TYPE;
  component: string;
  controller: string;
  id: string;
}

function getComponentsModel(
  components: Array<string>,
  controllers: Array<string>,
  type: COMPONENT_TYPE,
): Array<ComponentModel> {
  return components.map(component => {
    const componentName = path.basename(path.dirname(component));
    const controller = controllers.find(
      controller => path.basename(path.dirname(controller)) === componentName,
    );
    if (!controller) {
      throw new Error(`Missing controller file for the component in "${component}".
      Please create "controller.ts" file in "${path.dirname(component)}"`);
    }
    return {
      type,
      name: componentName,
      component,
      controller,
      // TODO: figure out where widget id should go
      id: '',
    };
  });
}

function getWidgetsModel(
  widgets: Array<string>,
  controllers: Array<string>,
): Array<ComponentModel> {
  return getComponentsModel(widgets, controllers, COMPONENT_TYPE.WIDGET);
}

export function generateFlowEditorModel(): FlowEditorModel {
  const artifactId = getProjectArtifactId();

  const widgets = globby.sync('./src/components/*/Component.js', {
    absolute: true,
  });
  const controllers = globby.sync('./src/components/*/controller.js', {
    absolute: true,
  });
  const initApp = globby.sync('./src/components/initApp.js', {
    absolute: true,
  })[0];
  const settings = globby.sync('./src/components/*/Settings.js', {
    absolute: true,
  });

  const widgetsModel = getWidgetsModel(widgets, controllers);

  if (!artifactId) {
    throw new Error(`artifact id not provided.
    Please insert <artifactId>yourArtifactId</artifactId> in your "pom.xml"`);
  }

  return {
    appDefId: '',
    artifactId,
    initApp,
    components: widgetsModel,
    settings: settings.map(settingPath => ({
      path: settingPath,
      name: path.basename(path.dirname(settingPath)),
    })),
  };
}
