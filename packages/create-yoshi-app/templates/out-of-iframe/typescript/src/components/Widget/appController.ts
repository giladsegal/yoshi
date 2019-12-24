import Experiments from '@wix/wix-experiments';

import {
  IWidgetControllerConfig,
  IWidgetController,
  IWixWindow,
} from '@wix/native-components-infra/dist/src/types/types';
import { EXPERIMENTS_SCOPE } from '../../config/constants';

export interface IMultiLangFields {
  isPrimaryLanguage: boolean;
  locale: string;
  lang: string;
}

function getSiteLanguage({ wixCodeApi }: IWidgetControllerConfig): string {
  if (wixCodeApi.window.multilingual.isEnabled) {
    return wixCodeApi.window.multilingual.currentLanguage;
  }

  // NOTE: language can be null (see WEED-18001)
  return wixCodeApi.site.language || 'en';
}

async function getExperimentsByScope(scope: string) {
  const experiments = new Experiments({
    scope,
  });
  await experiments.ready();
  return experiments.all();
}

export function getTranslationPath(baseUrl: string, locale: string): string {
  return `${baseUrl}assets/locales/messages_${locale}.json`;
}

async function getTranslations(
  baseUrl: string,
  locale: string,
): Promise<Record<string, string>> {
  const translationPath = getTranslationPath(baseUrl, locale);
  return fetch(translationPath, {
    method: 'get',
  })
    .then(response => response.json())
    .catch(e => {
      throw new Error(`Could not fetch ${translationPath}
        original error: ${e.message}`);
    });
}

function getMultiLangFields(
  multilingual: IWixWindow['multilingual'],
): IMultiLangFields {
  const currentShortLang = multilingual.currentLanguage;
  const currentLang = multilingual.siteLanguages.find(
    lang => lang.languageCode === currentShortLang,
  );
  if (currentLang) {
    return {
      isPrimaryLanguage: currentLang.isPrimaryLanguage,
      lang: currentShortLang,
      locale: currentLang.locale,
    };
  }

  return {
    isPrimaryLanguage: true,
    lang: 'en',
    locale: 'en',
  };
}

export async function createAppController(
  controllerConfig: IWidgetControllerConfig,
): Promise<IWidgetController> {
  const { appParams, setProps } = controllerConfig;
  const language = getSiteLanguage(controllerConfig);
  const fields = getMultiLangFields(
    controllerConfig.wixCodeApi.window.multilingual,
  );
  const [translations, experiments] = await Promise.all([
    getTranslations(appParams.baseUrls.staticsBaseUrl, fields.locale),
    getExperimentsByScope(EXPERIMENTS_SCOPE),
  ]);

  return {
    pageReady() {
      setProps({
        name: 'World',
        cssBaseUrl: appParams.baseUrls.staticsBaseUrl,
        language,
        experiments,
        translations,
      });
    },
  };
}
