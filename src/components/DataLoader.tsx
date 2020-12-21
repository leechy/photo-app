import React, { useEffect, useState } from 'react';

// hooks
import { useFirestoreItemQuery } from '../hooks/useFirestoreItemQuery';

// components
import LoadingScreen from './LoadingScreen';
import { IntlProvider } from 'react-intl';

const DataLoader: React.FC = ({ children }) => {
  /**
   * Localisation
   */

  // load available languages
  const locales = useFirestoreItemQuery('translations', 'locales');

  // choose a language to use
  const [locale, setLocale] = useState(window.localStorage.getItem('lang') || '');

  const getBrowserLocale = (langs: { [lang: string]: any }, defaultLocale = 'en') => {
    const targets = window?.navigator.languages || window?.navigator.language || defaultLocale;
    for (let i = 0; i < targets.length; i = i + 1) {
      if (langs[targets[i]]) return targets[i]; // exact match

      const bestMatch = Object.keys(langs).find((locale: any) => targets[i].startsWith(locale));
      if (bestMatch) return bestMatch; // en-US -> en
    }

    return defaultLocale;
  };

  useEffect(() => {
    if (locales?.item && Object.keys(locales.item).length && locale === '') {
      const newLocale = getBrowserLocale(locales.item);
      setLocale(newLocale);
      try {
        window.localStorage.setItem('lang', newLocale);
      } catch (e) {
        console.warn('No access to the local storage', e);
      }
    }
    // eslint-disable-next-line
  }, [locales, navigator.language, navigator.languages]);

  // load translations
  const messages = useFirestoreItemQuery('translations', locale);

  /**
   * Load Categories
   */
  useFirestoreItemQuery('meta', 'categories', { storeAs: 'categories' });

  if (messages.item) {
    return (
      <IntlProvider locale={locale} messages={messages.item} defaultLocale="en">
        {children}
      </IntlProvider>
    );
  }
  return <LoadingScreen />;
};

export default DataLoader;
