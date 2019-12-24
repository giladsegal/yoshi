import 'isomorphic-fetch';
import * as fetchMock from 'fetch-mock';
import { EXPERIMENTS_SCOPE } from '../config/constants';
import { mockExperiments } from '../components/Widget/appController.spec';
import { getTranslationPath } from '../components/Widget/appController';
import viewerScript from './viewerScript';

export function mockTranslations(baseUrl: string, locale: string) {
  return fetchMock.getOnce(
    getTranslationPath(baseUrl, locale),
    require(`../assets/locales/messages_${locale}.json`),
    { overwriteRoutes: true },
  );
}

describe('createControllers', () => {
  let widgetConfig;
  beforeEach(() => {
    widgetConfig = {
      appParams: {
        baseUrls: {
          staticsBaseUrl: 'http://localhost:3200/',
        },
      },
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
          language: 'en',
        },
      },
    };
  });

  it('should return controllers with pageReady method given widgets config', async () => {
    mockExperiments(EXPERIMENTS_SCOPE, { someExperiment: 'true' });
    mockTranslations(
      widgetConfig.appParams.baseUrls.staticsBaseUrl,
      widgetConfig.wixCodeApi.window.multilingual.currentLanguage,
    );

    const result = viewerScript.createControllers([widgetConfig]);
    expect(result).toHaveLength(1);
    expect((await result[0]).pageReady.call).toBeDefined();
  });
});
