import { useMemo } from 'react';
import { useFirestoreConnect, ReduxFirestoreQuerySetting } from 'react-redux-firebase';
import { useCollection } from './useCollection';

export function useFirestoreCollectionQuery(
  collection: string,
  ordered: boolean,
  options?: {
    where?: (string | boolean)[];
    orderBy?: string | string[] | [string, string][];
    limit?: number;
    startAt?: number;
    startAfter?: number;
    endAt?: number;
    ebdBefore?: number;
    storeAs?: string;
  }
) {
  const query = useMemo(
    () => ({
      collection,
      ...options
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [collection, ordered, options && options.storeAs, options && options.where]
  );

  // TODO: that works only for orderBy for now
  const queryString = options && options.storeAs ? options.storeAs : (collection + (options?.orderBy ? `?orderBy=${options.orderBy}` : ''));

  useFirestoreConnect((query as unknown) as ReduxFirestoreQuerySetting[]);
  return useCollection(options && options.storeAs ? options.storeAs : collection, ordered, queryString);
}
