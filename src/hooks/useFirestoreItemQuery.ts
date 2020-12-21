import { useMemo } from 'react';
import { useFirestoreConnect, ReduxFirestoreQuerySetting } from 'react-redux-firebase';
import { useCollectionItem } from './useCollectionItem';

export function useFirestoreItemQuery(
  collection: string,
  itemId: string,
  options?: {
    storeAs?: string;
  },
) {
  const query = useMemo(
    () => ({
      collection: itemId ? collection : 'system',
      doc: itemId || 'system',
      ...options,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemId],
  );

  useFirestoreConnect((query as unknown) as ReduxFirestoreQuerySetting[]);
  return useCollectionItem(collection, itemId, options?.storeAs);
}
