import { parse } from 'intl-messageformat-parser';
import { TMessage } from '../models/Message';

export const extractLangPhrases = (
  items: { [msgId: string]: TMessage },
  langId: string,
): { [msgId: string]: string } => {
  return Object.keys(items)
    .map(msgId => items[msgId])
    .map(msg => {
      return {
        id: msg.id,
        phrase: msg.phrases ? (typeof msg.phrases === 'string' ? msg.phrases : msg.phrases[langId] || null) : null,
      };
    })
    .filter(msg => msg.phrase !== null)
    .reduce((acc, item) => (item ? { ...acc, [item.id]: item.phrase } : acc), {});
};

export const compileTranslations = (phrases: { [phraseId: string]: string }) => {
  return Object.keys(phrases)
    .map(phraseId => {
      if (phrases[phraseId]) {
        return {
          id: phraseId,
          ast: parse(phrases[phraseId]),
        };
      }
      return null;
    })
    .filter(phrase => phrase !== null)
    .reduce((acc, item) => (item ? { ...acc, [item.id]: item.ast } : acc), {});
};
