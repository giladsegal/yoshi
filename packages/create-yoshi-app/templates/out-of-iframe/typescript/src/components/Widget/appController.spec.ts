import LaboratoryTestkit from '@wix/wix-experiments/dist/src/laboratory-testkit';
import { ExperimentsBag } from '@wix/wix-experiments';
import { EXPERIMENTS_SCOPE } from '../../config/constants';

import { mockTranslations } from '../../viewerApp/viewerScript.spec';
import { createAppController } from './appController';

export function mockExperiments(
  scope: string,
  experiments: ExperimentsBag,
): void {
  new LaboratoryTestkit()
    .withScope(scope)
    .withBaseUrl(window.location.href)
    .withExperiments(experiments)
    .start();
}

describe('createAppController', () => {
  it('should call setProps with data', async () => {
    const language = 'en-US';
    const experiments = { someExperiment: 'true' };
    const setPropsSpy = jest.fn();
    const appParams: any = {
      baseUrls: {
        staticsBaseUrl: 'http://some-static-url.com',
      },
    };
    const widgetConfig: any = {
      appParams,
      setProps: setPropsSpy,
      wixCodeApi: {
        window: {
          multilingual: {
            isEnabled: false,
            currentLanguage: 'en',
            siteLanguages: [
              {
                languageCode: 'en',
                isPrimaryLanguage: true,
                locale: 'en',
              },
            ],
          },
        },
        site: {
          language,
        },
      },
    };
    mockExperiments(EXPERIMENTS_SCOPE, { someExperiment: 'true' });
    mockTranslations(
      appParams.baseUrls.staticsBaseUrl,
      widgetConfig.wixCodeApi.window.multilingual.currentLanguage,
    );

    const controller = await createAppController(widgetConfig);

    controller.pageReady();

    expect(setPropsSpy).toBeCalledWith({
      name: 'World',
      cssBaseUrl: appParams.baseUrls.staticsBaseUrl,
      language,
      experiments,
      translations: {
        'app.hello': 'Hello',
      },
    });
  });
});
