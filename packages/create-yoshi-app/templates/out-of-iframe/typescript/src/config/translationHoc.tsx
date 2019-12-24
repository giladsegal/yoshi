import * as React from 'react';

const TranslationContext = React.createContext({});
export interface TranslationProviderProps {
  value: Record<string, string>;
}
export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  value,
  children,
}) => {
  return (
    <TranslationContext.Provider value={value || {}}>
      {children}
    </TranslationContext.Provider>
  );
};

type TranslationFunction = (
  key: string,
  values?: {},
  fallback?: string,
) => string;

function translate(key: string, replaces: { [p: string]: string }): string {
  return key.replace(/\{\{([^}]+)\}\}/gi, (_match, k) => {
    return replaces[k.trim()] || '';
  });
}

function getTranslationWithValue(
  translations: Record<string, string>,
): TranslationFunction {
  return (translationKey: string, values: {}) => {
    return translations[translationKey] === undefined
      ? translationKey
      : translate(translations[translationKey], values);
  };
}

export const withTranslations = (
  Component: any,
): React.FunctionComponent | any =>
  React.forwardRef((props, ref) => {
    return (
      <TranslationContext.Consumer>
        {translations => (
          <Component
            {...props}
            ref={ref}
            t={getTranslationWithValue(translations)}
          />
        )}
      </TranslationContext.Consumer>
    );
  });
