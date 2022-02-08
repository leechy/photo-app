import React, { useEffect, useState } from 'react';

// hooks
import { useFirestoreItemQuery } from '../hooks/useFirestoreItemQuery';

// components
import LoadingScreen from './LoadingScreen';
import { IntlProvider } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { TStoreState } from '../store';

const DataLoader: React.FC = ({ children }) => {
  /**
   * Localisation
   */

  // load available languages
  const locales = useFirestoreItemQuery('translations', 'locales');

  // get language from the state
  const stateLang = useSelector((state: TStoreState) => state.ui?.lang);
  useEffect(() => {
    if (stateLang !== '' && stateLang !== locale) {
      setLocale(stateLang);
    }
    // eslint-disable-next-line
  }, [stateLang]);

  // choose a language to use
  const [locale, setLocale] = useState(window.localStorage.getItem('lang') || '');
  useEffect(() => {
    if (locale !== '' && locale !== stateLang) {
      dispatch({ type: 'SET_LANG', payload: locale });
    }
    // eslint-disable-next-line
  }, [locale]);

  const getBrowserLocale = (langs: { [lang: string]: any }, defaultLocale = 'en') => {
    const targets = window?.navigator.languages || window?.navigator.language || defaultLocale;
    for (let i = 0; i < targets.length; i = i + 1) {
      if (langs[targets[i]] && langs[targets[i]].active) return targets[i]; // exact match

      const bestMatch = Object.keys(langs)
        .filter(locale => langs[locale].active)
        .find((locale: any) => targets[i].startsWith(locale)); // en-US -> en
      if (bestMatch) return bestMatch;
    }

    return defaultLocale;
  };

  const dispatch = useDispatch();
  useEffect(() => {
    if (locales?.item && Object.keys(locales.item).length && locale === '') {
      const newLocale = getBrowserLocale(locales.item);
      dispatch({ type: 'SET_LANG', payload: newLocale });

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
   * Load App Settings
   */
  useFirestoreItemQuery('meta', 'app');

  /**
   * Load Categories
   */
  useFirestoreItemQuery('meta', 'categories');

  /**
   * Load Pages content
   */
  useFirestoreItemQuery('meta', 'pages');

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
