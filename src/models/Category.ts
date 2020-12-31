import { TLangString } from './LangString';

export type TCategory = {
  id: string;
  title?: TLangString;
  order: number;
  active?: boolean;
};
