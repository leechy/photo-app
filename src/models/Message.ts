import { TLangString } from './LangString';

export type TMessage = {
  id: string;
  description?: string;
  phrases?: TLangString;
};
