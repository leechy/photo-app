export type TLangString =
  | undefined
  | string
  | {
      [langId: string]: string;
    };
