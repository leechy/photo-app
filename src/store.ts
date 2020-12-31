import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/analytics';
// import 'firebase/functions' // <- needed if using httpsCallable

import { createStore, combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore';
import { firebaseConfig } from './firebase-config';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

// models
import { TLang } from './models/Lang';
import { TAppData } from './models/AppData';
import { TCategory } from './models/Category';
import { TPage } from './models/Page';
import { TMessage } from './models/Message';

// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
};

// Initialize firebase instance
firebase.initializeApp(firebaseConfig);

// Initialize other services on firebase instance
firebase.firestore();
firebase.storage();
firebase.analytics();
// firebase.functions() // <- needed if using httpsCallable

// Additional reducers
const ui = (state = {}, action: any) => {
  switch (action.type) {
    case 'SHOW_TABS':
      return {
        ...state,
        showTabs: true,
      };
    case 'HIDE_TABS':
      return {
        ...state,
        showTabs: false,
      };
    case 'SET_LANG':
      return {
        ...state,
        lang: action.payload,
      };
    default:
      return state;
  }
};

// Add firebase and firestore to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  ui,
});

export type TStoreState = {
  firebase: any;
  firestore: {
    data?: {
      translations?: {
        locales?: {
          [langId: string]: TLang;
        };
        messages?: {
          [msgId: string]: TMessage;
        };
      };
      meta?: {
        app?: TAppData;
        categories?: {
          [catId: string]: TCategory;
        };
        pages?: {
          [pageId: string]: TPage;
        };
      };
    };
  };
  ui: {
    showTabs: boolean;
    lang: string;
  };
};

// Create store with reducers and initial state
const initialState: TStoreState = {
  firebase: {},
  firestore: {},
  ui: {
    showTabs: true,
    lang: '',
  },
};

export const store = createStore(rootReducer, initialState as any, composeWithDevTools());

export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};
