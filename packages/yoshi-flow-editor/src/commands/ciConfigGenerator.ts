import fs from 'fs-extra';
import { CI_CONFIG } from '../constants';
import { FlowEditorModel, ComponentModel } from '../model';

function generatePlatformBaseUrl(appName: string, artifactId: string): string {
  return `appFields.platform.baseUrls.${appName}BaseUrl=>https://static.parastorage.com/services/${artifactId}/{version}/`;
}

function generateWidgetsUrls(
  components: Array<ComponentModel>,
  artifactId: string,
): Array<string> {
  const controllerConfig = components.map(component =>
    generateWidgetControllerUrl(component, artifactId),
  );

  return controllerConfig.concat(
    components.map(component =>
      generateWidgetComponentUrl(component, artifactId),
    ),
  );
}

function generateWidgetControllerUrl(
  { id, name }: ComponentModel,
  artifactId: string,
): string {
  return `widgets[?(@.widgetId=='${id}')].componentFields.controllerUrl=>https://static.parastorage.com/services/${artifactId}/{version}/${name}Controller.bundle.min.js`;
}

function generateWidgetComponentUrl(
  { id, name }: ComponentModel,
  artifactId: string,
): string {
  return `widgets[?(@.widgetId=='${id}')].componentFields.componentUrl=>https://static.parastorage.com/services/${artifactId}/{version}/${name}ViewerWidget.bundle.min.js`;
}

export function writeCiConfig(model: FlowEditorModel): Promise<void> {
  const ciConfig = {
    app_def_id: model.appDefId,
    ignore_dependencies: 'clear',
    tpa_url_templates: [
      generatePlatformBaseUrl(model.appName, model.artifactId),
      ...generateWidgetsUrls(model.components, model.artifactId),
    ],
  };

  return fs.outputJson(CI_CONFIG, ciConfig, { spaces: 2 });
}
