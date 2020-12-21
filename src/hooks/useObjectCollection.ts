import { useSelector, shallowEqual } from 'react-redux';
import { useRequestStateFor } from './useRequestStateFor';
import { RequestState } from '../models/RequestState';

type RequestedObjectCollection = {
  items: { [id: string]: any };
  state: RequestState;
};

export function useObjectCollection(collection: string): RequestedObjectCollection {
  const requestState = useRequestStateFor(collection);
  const items = useSelector((state: any) => {
    return state.firestore.data[collection]
  }, shallowEqual);

  return {
    items,
    state: {
      ...requestState,
      isNotFound: requestState.isLoaded && !items,
      isEmpty: requestState.isLoaded && (!items || !Object.keys(items).length)
    }
  };
}
