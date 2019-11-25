import memoize from 'lodash/memoize';
import i18next from 'i18next';

export const i18nInstance = i18next.createInstance();

export default memoize(function i18n(initialLanguage) {
  return i18nInstance
    .use({
      type: 'backend',
      read: async (language: string, namespace: string, callback: Function) => {
        // We configure how i18next should fetch a translation resource when it
        // needs it: We use Webpack's dynamic imports to fetch resources without
        // increasing our bundle size.
        //
        // See https://webpack.js.org/guides/code-splitting/#dynamic-imports for
        // more information.

        // TODO: move it to the glue code
        const prjPath =
          '/Users/deansh/Projects/yoshi/packages/create-yoshi-app/templates/flow-editor/javascript/src';
        return import(`${prjPath}/assets/locales/messages_${language}.json`)
          .then(translation => callback(null, translation))
          .catch(error => callback(error));
      },
    })
    .init({
      // Initial language
      lng: initialLanguage,

      // Fallback language
      fallbackLng: 'en',

      // Don't use a key separator (no support for nested translation objects)
      keySeparator: false,

      // Wait for translation data to be available before rendering a component
      react: {
        wait: true,
      },
    });
});
