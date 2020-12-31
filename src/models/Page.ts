import { TLangString } from './LangString';

export type TPage = {
  id: string;
  title?: TLangString;
  order: number;
  content?: TLangString;
};
