import React, { useEffect, useState } from 'react';
import { useFirestoreItemQuery } from '../hooks/useFirestoreItemQuery';
import { useFirestore } from 'react-redux-firebase';

// components
import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonReorder, IonReorderGroup, isPlatform } from '@ionic/react';
import LoadingScreen from '../components/LoadingScreen';
import { FormattedMessage, useIntl } from 'react-intl';
import AppPage from '../components/AppPage';

// types
import { closeCircleOutline } from 'ionicons/icons';
import { ItemReorderEventDetail } from '@ionic/core';
import { TLang } from '../models/Lang';

const LanguagesListPage: React.FC = () => {
  const intl = useIntl();

  /**
   * Languages list
   */
  const locales = useFirestoreItemQuery('translations', 'locales');
  const [items, setItems] = useState<TLang[]>(
    locales?.item ? Object.keys(locales.item).map((localeId: string) => locales.item[localeId]) : [],
  );
  useEffect(() => {
    if (locales?.item) {
      setItems(Object.keys(locales.item).map((localeId: string) => locales.item[localeId]));
    }
    // eslint-disable-next-line
  }, [locales.item]);

  /**
   * Edit mode
   */
  const [editMode, setEditMode] = useState(false);

  const turnOnEditMode = () => {
    setEditMode(true);
  };

  const cancelEditMode = () => {
    setItems(Object.keys(locales.item).map((localeId: string) => locales.item[localeId]));
    setEditMode(false);
  };

  const onReorder = (evt: CustomEvent<ItemReorderEventDetail>) => {
    const newOrder = evt.detail.complete(items);
    setItems(newOrder.map((lang: TLang, index: number) => ({ ...lang, order: index })));
  };

  const deleteItem = (itemId: string) => {
    setItems(items.filter(item => item.code !== itemId));
  };

  const firestore = useFirestore();
  const saveEdits = () => {
    firestore
      .doc('/translations/locales')
      .set(items.reduce((acc, item) => ({ ...acc, [item.code]: item }), {}))
      .then(() => setEditMode(false));
  };

  return (
    <AppPage
      title={intl.formatMessage({ id: 'private.languages.title' })}
      showHeading={true}
      backHref="/settings/translations"
      buttons={
        editMode ? (
          <>
            <IonButton onClick={cancelEditMode} color="primary">
              <FormattedMessage id="buttons.cancel" defaultMessage="Cancel" />
            </IonButton>
            <IonButton onClick={saveEdits}>
              <FormattedMessage id="buttons.save" defaultMessage="Save" />
            </IonButton>
          </>
        ) : (
          <>
            <IonButton onClick={turnOnEditMode}>
              <FormattedMessage id="buttons.edit" defaultMessage="Edit" />
            </IonButton>
            <IonButton routerLink="/settings/categories/new">
              <FormattedMessage id="buttons.add" defaultMessage="Add" />
            </IonButton>
          </>
        )
      }
    >
      {items.length ? (
        <IonList>
          <IonReorderGroup disabled={!editMode} onIonItemReorder={onReorder}>
            {items
              .sort((item1, item2) => (item1.order > item2.order ? 1 : -1))
              .map(lang => (
                <IonItem
                  key={lang.code}
                  routerLink={editMode ? undefined : `/settings/translations/languages/${lang.code}`}
                  detail={!editMode && isPlatform('ios')}
                >
                  <IonReorder slot="start" />
                  <IonLabel>
                    <h2>
                      {lang.title} ({lang.code})
                    </h2>
                    <p>
                      {lang.active ? (
                        <FormattedMessage id="state.active" defaultMessage="Active" />
                      ) : (
                        <FormattedMessage id="state.inactive" defaultMessage="Inactive" />
                      )}
                    </p>
                  </IonLabel>
                  {editMode && (
                    <IonButton
                      slot="end"
                      fill="clear"
                      shape="round"
                      color="danger"
                      data-code={lang.code}
                      onClick={() => deleteItem(lang.code)}
                    >
                      <IonIcon slot="icon-only" icon={closeCircleOutline} />
                    </IonButton>
                  )}
                </IonItem>
              ))}
          </IonReorderGroup>
        </IonList>
      ) : (
        <LoadingScreen />
      )}
    </AppPage>
  );
};

export default LanguagesListPage;
