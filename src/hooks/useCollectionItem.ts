import { useSelector, shallowEqual } from 'react-redux';
import { useRequestStateFor } from './useRequestStateFor';
import { RequestState } from '../models/RequestState';

type RequestedCollectionItem = {
  item: { [prop: string]: any };
  state: RequestState;
};
export function useCollectionItem(collection: string, itemId: string = '', query?: string): RequestedCollectionItem {
  const requestState = useRequestStateFor(query || collection, itemId);

  const item = useSelector((state: any) => {
    return query && state.firestore.data[query]
      ? state.firestore.data[query][itemId] || state.firestore.data[query]
      : state.firestore.data[collection] && state.firestore.data[collection][itemId];
  }, shallowEqual);

  return {
    item,
    state: {
      ...requestState,
      isNotFound: requestState.isLoaded && !item,
      isEmpty: requestState.isLoaded && !!item && !Object.keys(item).length,
    },
  };
}
