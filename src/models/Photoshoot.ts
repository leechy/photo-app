import { TLangString } from './LangString';
import { TDates } from './Dates';
import { RequestState } from './RequestState';

export type TPhotoshoot = {
  id: string;
  date: TDates;
  title?: TLangString;
  category?: string;
  client?: string;
  location?: string;
};

export type TPhotoshootsState = {
  items: { [id: string]: TPhotoshoot };
  state: RequestState;
};

export type TPhotoshootsOrderedState = {
  items: TPhotoshoot[];
  state: RequestState;
};
