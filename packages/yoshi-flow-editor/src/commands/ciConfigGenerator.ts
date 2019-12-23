import fs from 'fs-extra';
import { CI_CONFIG } from '../constants';
import { FlowEditorModel } from '../model';

function generatePlatformBaseUrl(appName: string, baseUrl: string): string {
  return `appFields.platform.baseUrls.${appName}BaseUrl=>https://static.parastorage.com/services/${baseUrl}/{version}/`;
}

function generateWidgetsUrls(
  components: FlowEditorModel['components'],
  baseUrl: string,
): Array<string> {
  const controllerConfig = components.map(component =>
    generateWidgetControllerUrl(component, baseUrl),
  );

  return controllerConfig.concat(
    components.map(component => generateWidgetComponentUrl(component, baseUrl)),
  );
}

function generateWidgetControllerUrl(
  { id, name }: FlowEditorModel['components'][0],
  baseUrl: string,
): string {
  return `widgets[?(@.widgetId=='${id}')].componentFields.controllerUrl=>https://static.parastorage.com/services/${baseUrl}/{version}/${name}Controller.bundle.min.js`;
}

function generateWidgetComponentUrl(
  { id, name }: FlowEditorModel['components'][0],
  baseUrl: string,
): string {
  return `widgets[?(@.widgetId=='${id}')].componentFields.componentUrl=>https://static.parastorage.com/services/${baseUrl}/{version}/${name}.bundle.min.js`;
}

export function generateCiConfig(model: FlowEditorModel) {
  const appName = model.components[0].name;
  const baseUrl = model.artifactId;
  const ciConfig = {
    app_def_id: model.appDefId,
    ignore_dependencies: 'clear',
    tpa_url_templates: [
      generatePlatformBaseUrl(appName, baseUrl),
      ...generateWidgetsUrls(model.components, baseUrl),
    ],
  };

  fs.outputJson(CI_CONFIG, ciConfig, { spaces: 2 });
}
