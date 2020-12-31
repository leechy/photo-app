import { TLangString } from '../models/LangString';

export const getTitle = (title: TLangString) => {
  if (typeof title === 'string') return title;
  const lang = localStorage.getItem('lang') || 'en';
  if (title) {
    if (title[lang]) return title[lang];
    return title['en'];
  }
  return '';
};
