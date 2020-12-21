import { useSelector, shallowEqual } from 'react-redux';
import { useRequestStateFor } from './useRequestStateFor';
import { RequestState } from '../models/RequestState';

type RequestedCollection = {
  items: any[] | { [id: string]: any };
  state: RequestState;
};
export function useCollection(collection: string, ordered = false, query?: string): RequestedCollection {
  const requestState = useRequestStateFor(query || collection);
  const path = collection.split('/');
  const dataSource = ordered ? 'ordered' : 'data';
  const items = useSelector(
    (state: any) =>
      state.firestore[dataSource][collection] ||
      (path.length === 2 && state.firestore.data[path[0]] && state.firestore.data[path[0]][path[1]]) ||
      (path.length === 3 &&
        state.firestore.data[path[0]] &&
        state.firestore.data[path[0]][path[1]] &&
        state.firestore.data[path[0]][path[1]][path[2]]) ||
      null,
    shallowEqual,
  );

  return {
    items,
    state: {
      ...requestState,
      isNotFound: requestState.isLoaded && !items,
      isEmpty: requestState.isLoaded && (!items || (!items.length && !Object.keys(items).length)),
    },
  };
}
