import { useSelector } from 'react-redux';

/**
 * Returns state of the requested collection as object with
 * predefined states:
 *
 * @param collection name of the collection to check
 */
type RequestState = {
  isNotLoaded: boolean;
  isLoading: boolean;
  isLoaded: boolean;
};
export function useRequestStateFor(collection: string, itemId: string = ''): RequestState {
  const state = {
    isNotLoaded: false,
    isLoading: false,
    isLoaded: false
  };
  const dbStatus = useSelector((state: any) => state.firestore.status);
  if (dbStatus) {
    if (
      (dbStatus.requesting[collection] === false && dbStatus.requested[collection]) ||
      (dbStatus.requesting[`${collection}/${itemId}`] === false &&
        dbStatus.requested[`${collection}/${itemId}`])
    ) {
      state.isLoaded = true;
    } else if (
      (dbStatus.requesting[collection] && dbStatus.requested[collection] === false) ||
      (dbStatus.requesting[`${collection}/${itemId}`] &&
        dbStatus.requested[`${collection}/${itemId}`] === false)
    ) {
      state.isLoading = true;
    } else {
      state.isNotLoaded = true;
    }
  } else {
    state.isNotLoaded = true;
  }
  return state;
}
