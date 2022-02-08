import React, { Suspense, lazy } from 'react';

import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { store, rrfProps } from './store';

import { Redirect, Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';

// components
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { cameraOutline, easelOutline, languageOutline, mailOpenOutline, trailSignOutline } from 'ionicons/icons';
import DataLoader from './components/DataLoader';
import { FormattedMessage } from 'react-intl';

// pages
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/Categories';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import PrivatePage from './pages/Private';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* General styles */
import './theme/general.scss';
import LoadingScreen from './components/LoadingScreen';

// lazy loaded pages
const CategoriesListPage = lazy(() => import('./pages/CategoriesList'));
const CategoryEditPage = lazy(() => import('./pages/CategoryEdit'));
const PagesListPage = lazy(() => import('./pages/PagesList'));
const PageEditPage = lazy(() => import('./pages/PageEdit'));
const AppSettingsPage = lazy(() => import('./pages/AppSettings'));
const TranslationsPage = lazy(() => import('./pages/Translations'));
const LanguagesListPage = lazy(() => import('./pages/LanguagesList'));
const LanguageEditPage = lazy(() => import('./pages/LanguageEdit'));
const PhrasesListPage = lazy(() => import('./pages/PhrasesList'));
const PhraseEditPage = lazy(() => import('./pages/PhraseEdit'));
const PhotoshootsListPage = lazy(() => import('./pages/PhotoshootsList'));
const PhotoshootEditPage = lazy(() => import('./pages/PhotoshootEdit'));

const App: React.FC = () => (
  <IonApp>
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <DataLoader>
          <Suspense fallback={<LoadingScreen />}>
            <IonReactRouter>
              <IonTabs>
                <IonRouterOutlet>
                  <Route path="/home" component={HomePage} exact={true} />
                  <Route path="/categories" component={CategoriesPage} exact={true} />
                  <Route path="/about" component={AboutPage} />
                  <Route path="/contact" component={ContactPage} />
                  <Route path="/settings" exact={true} component={PrivatePage} />
                  <Route path="/settings/photoshoots" exact={true} component={PhotoshootsListPage} />
                  <Route path="/settings/photoshoots/:itemId" exact={true} component={PhotoshootEditPage} />
                  <Route path="/settings/categories" exact={true} component={CategoriesListPage} />
                  <Route path="/settings/categories/:itemId" exact={true} component={CategoryEditPage} />
                  <Route path="/settings/pages-content" exact={true} component={PagesListPage} />
                  <Route path="/settings/pages-content/:itemId" component={PageEditPage} />
                  <Route path="/settings/app-settings" exact={true} component={AppSettingsPage} />
                  <Route path="/settings/translations" exact={true} component={TranslationsPage} />
                  <Route path="/settings/translations/languages" exact={true} component={LanguagesListPage} />
                  <Route path="/settings/translations/languages/:langId" component={LanguageEditPage} />
                  <Route path="/settings/translations/phrases" exact={true} component={PhrasesListPage} />
                  <Route path="/settings/translations/phrases/:itemId" exact={true} component={PhraseEditPage} />
                  <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
                </IonRouterOutlet>
                <IonTabBar slot="top">
                  <IonTabButton tab="home" href="/home">
                    <IonIcon icon={easelOutline} />
                    <IonLabel>
                      <FormattedMessage id="menu.home" defaultMessage="Featured" />
                    </IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="about" href="/about">
                    <IonIcon icon={cameraOutline} />
                    <IonLabel>
                      <FormattedMessage id="menu.about" defaultMessage="About" />
                    </IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="categories" href="/categories">
                    <IonIcon icon={trailSignOutline} />
                    <IonLabel>
                      <FormattedMessage id="menu.categories" defaultMessage="Categories" />
                    </IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="contact" href="/contact">
                    <IonIcon icon={mailOpenOutline} />
                    <IonLabel>
                      <FormattedMessage id="menu.contact" defaultMessage="Contact" />
                    </IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="private" href="/settings">
                    <IonIcon icon={languageOutline} />
                    <IonLabel>
                      <FormattedMessage id="menu.language" defaultMessage="English" />
                    </IonLabel>
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>
            </IonReactRouter>
          </Suspense>
        </DataLoader>
      </ReactReduxFirebaseProvider>
    </Provider>
  </IonApp>
);

export default App;
