import { useSelector, shallowEqual } from 'react-redux';
import { useRequestStateFor } from './useRequestStateFor';
import { RequestState } from '../models/RequestState';

type RequestedOrderedCollection = {
  items: any[];
  state: RequestState;
};
export function useOrderedCollection(collection: string): RequestedOrderedCollection {
  const requestState = useRequestStateFor(collection);
  const items = useSelector((state: any) => state.firestore.ordered[collection], shallowEqual);

  return {
    items,
    state: {
      ...requestState,
      isNotFound: requestState.isLoaded && !items,
      isEmpty: requestState.isLoaded && !items.length
    }
  };
}
