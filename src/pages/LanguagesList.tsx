import React, { useEffect, useState } from 'react';
import { useFirestoreItemQuery } from '../hooks/useFirestoreItemQuery';
import { useFirestore } from 'react-redux-firebase';

// components
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonReorder,
  IonReorderGroup,
  IonTitle,
  IonToolbar,
  isPlatform,
} from '@ionic/react';
import LoadingScreen from '../components/LoadingScreen';
import { FormattedMessage } from 'react-intl';

// types
import { closeCircleOutline } from 'ionicons/icons';
import { ItemReorderEventDetail } from '@ionic/core';
import { TLang } from '../models/Lang';

const LanguagesListPage: React.FC = () => {
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
    <IonPage>
      <IonHeader>
        <IonToolbar mode="md">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings/translations" />
          </IonButtons>
          <IonTitle>
            <FormattedMessage id="private.languages.title" defaultMessage="Languages" />
          </IonTitle>
          <IonButtons slot="end">
            {editMode ? (
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
                <IonButton routerLink="/settings/translations/languages/new">
                  <FormattedMessage id="buttons.add" defaultMessage="Add" />
                </IonButton>
              </>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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
      </IonContent>
    </IonPage>
  );
};

export default LanguagesListPage;
