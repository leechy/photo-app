import { TLangString } from './LangString';

export type TCategory = {
  id: string;
  title?: TLangString;
  description?: TLangString;
  order: number;
  active?: boolean;
};
