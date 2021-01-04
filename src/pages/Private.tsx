import React, { useEffect, useState } from 'react';
import { useFirestoreItemQuery } from '../hooks/useFirestoreItemQuery';
import { useDispatch } from 'react-redux';

import { IonAvatar, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList } from '@ionic/react';
import { FormattedMessage, useIntl } from 'react-intl';
import AppPage from '../components/AppPage';

import {
  apertureOutline,
  checkmarkOutline,
  globeOutline,
  newspaperOutline,
  // peopleOutline,
  pricetagsOutline,
  settingsOutline,
} from 'ionicons/icons';
import { TLang } from '../models/Lang';

const PrivatePage: React.FC = () => {
  /**
   * Languages list
   */
  const intl = useIntl();
  const locales = useFirestoreItemQuery('translations', 'locales');
  const dispatch = useDispatch();
  const [langs, setLangs] = useState<TLang[]>(
    locales?.item
      ? Object.keys(locales.item)
          .map((localeId: string) => locales.item[localeId])
          .filter(item => item.active)
          .sort((item1, item2) => (item1.order > item2.order ? 1 : -1))
      : [],
  );
  useEffect(() => {
    if (locales?.item) {
      setLangs(
        Object.keys(locales.item)
          .map((localeId: string) => locales.item[localeId])
          .filter(item => item.active)
          .sort((item1, item2) => (item1.order > item2.order ? 1 : -1)),
      );
    }
    // eslint-disable-next-line
  }, [locales.item]);

  const changeLanguage = (newLang: string) => {
    window.localStorage.setItem('lang', newLang);
    dispatch({ type: 'SET_LANG', payload: newLang });
  };

  return (
    <AppPage title={intl.formatMessage({ id: 'private.title' })} showHeading={true}>
      <IonList>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>
              <FormattedMessage id="private.language.title" defaultMessage="Language" />
            </IonLabel>
          </IonItemDivider>
          {langs &&
            langs.map(lang => (
              <IonItem button detail={false} key={lang.code} onClick={() => changeLanguage(lang.code)}>
                <IonLabel>{lang.title}</IonLabel>
                {intl.locale === lang.code && <IonIcon slot="end" icon={checkmarkOutline} />}
              </IonItem>
            ))}
        </IonItemGroup>

        {/* <IonItemGroup>
            <IonItemDivider>
              <IonLabel>
                <FormattedMessage id="private.clients.title" defaultMessage="Clients" />
              </IonLabel>
            </IonItemDivider>
            <IonItem routerLink="/settings/users">
              <IonAvatar slot="start">
                <IonIcon icon={peopleOutline} />
              </IonAvatar>
              <IonLabel className="ion-text-wrap">
                <h2>
                  <FormattedMessage id="private.users.title" defaultMessage="Users" />
                </h2>
                <p>
                  <FormattedMessage
                    id="private.users.description"
                    defaultMessage="Manage user accounts and available photos"
                  />
                </p>
              </IonLabel>
            </IonItem>
          </IonItemGroup> */}

        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>
              <FormattedMessage id="private.photos.title" defaultMessage="Photos" />
            </IonLabel>
          </IonItemDivider>
          <IonItem routerLink="/settings/photoshoots">
            <IonAvatar slot="start">
              <IonIcon icon={apertureOutline} />
            </IonAvatar>
            <IonLabel className="ion-text-wrap">
              <h2>
                <FormattedMessage id="private.photoshoots.title" defaultMessage="Photo Shoots" />
              </h2>
              <p>
                <FormattedMessage
                  id="private.photoshoots.description"
                  defaultMessage="Series of photos combined by user, place or date"
                />
              </p>
            </IonLabel>
          </IonItem>
          <IonItem routerLink="/settings/categories">
            <IonAvatar slot="start">
              <IonIcon icon={pricetagsOutline} />
            </IonAvatar>
            <IonLabel className="ion-text-wrap">
              <h2>
                <FormattedMessage id="private.categories.title" defaultMessage="Categories" />
              </h2>
              <p>
                <FormattedMessage
                  id="private.categories.description"
                  defaultMessage="Names, preview images and order"
                />
              </p>
            </IonLabel>
          </IonItem>
        </IonItemGroup>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>
              <FormattedMessage id="private.settings.title" defaultMessage="Application Settings" />
            </IonLabel>
          </IonItemDivider>
          <IonItem routerLink="/settings/pages-content">
            <IonAvatar slot="start">
              <IonIcon icon={newspaperOutline} />
            </IonAvatar>
            <IonLabel className="ion-text-wrap">
              <h2>
                <FormattedMessage id="private.pages.title" defaultMessage="Pages Content" />
              </h2>
              <p>
                <FormattedMessage
                  id="private.pages.description"
                  defaultMessage="Custom text content for specific pages"
                />
              </p>
            </IonLabel>
          </IonItem>
          <IonItem routerLink="/settings/app-settings">
            <IonAvatar slot="start">
              <IonIcon icon={settingsOutline} />
            </IonAvatar>
            <IonLabel className="ion-text-wrap">
              <h2>
                <FormattedMessage id="private.general.title" defaultMessage="General Settings" />
              </h2>
              <p>
                <FormattedMessage id="private.general.description" defaultMessage="App name, Social links, etc." />
              </p>
            </IonLabel>
          </IonItem>
          <IonItem routerLink="/settings/translations">
            <IonAvatar slot="start">
              <IonIcon icon={globeOutline} />
            </IonAvatar>
            <IonLabel className="ion-text-wrap">
              <h2>
                <FormattedMessage id="private.translations.title" defaultMessage="Translations" />
              </h2>
              <p>
                <FormattedMessage id="private.translations.description" defaultMessage="Languages and phrases" />
              </p>
            </IonLabel>
          </IonItem>
        </IonItemGroup>
      </IonList>
    </AppPage>
  );
};

export default PrivatePage;
