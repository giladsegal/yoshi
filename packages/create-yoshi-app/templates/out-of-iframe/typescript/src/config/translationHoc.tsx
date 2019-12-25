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
  return (translationKey: string, values: Record<string, string>) => {
    return translations[translationKey] === undefined
      ? translationKey
      : translate(translations[translationKey], values);
  };
}

export interface TranslationProps {
  t(translationKey: string, values?: Record<string, string>): string;
}
export function withTranslations<T extends TranslationProps>(
  Component: React.ComponentType<T>,
) {
  return (props: T) => (
    <TranslationContext.Consumer>
      {translations => (
        <Component {...props} t={getTranslationWithValue(translations)} />
      )}
    </TranslationContext.Consumer>
  );
}
