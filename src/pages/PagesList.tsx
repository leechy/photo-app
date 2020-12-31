import React, { useEffect, useState } from 'react';
import { useFirestoreItemQuery } from '../hooks/useFirestoreItemQuery';
import { useFirestore } from 'react-redux-firebase';
import { getTitle } from '../utils/i18n';

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
import { TPage } from '../models/Page';

const PagesListPage: React.FC = () => {
  /**
   * Items list
   */
  const pages = useFirestoreItemQuery('meta', 'pages');
  const [items, setItems] = useState<TPage[]>(
    pages?.item
      ? Object.keys(pages.item)
          .map((pageId: string) => pages.item[pageId])
          .sort((item1, item2) => (item1.order > item2.order ? 1 : -1))
      : [],
  );
  useEffect(() => {
    if (pages?.item) {
      setItems(
        Object.keys(pages.item)
          .map((pageId: string) => pages.item[pageId])
          .sort((item1, item2) => (item1.order > item2.order ? 1 : -1)),
      );
    }
    // eslint-disable-next-line
  }, [pages.item]);

  /**
   * Edit mode
   */
  const [editMode, setEditMode] = useState(false);

  const turnOnEditMode = () => {
    setEditMode(true);
  };

  const cancelEditMode = () => {
    setItems(
      Object.keys(pages.item)
        .map((pageId: string) => pages.item[pageId])
        .sort((item1, item2) => (item1.order > item2.order ? 1 : -1)),
    );
    setEditMode(false);
  };

  const onReorder = (evt: CustomEvent<ItemReorderEventDetail>) => {
    const newOrder = evt.detail.complete(items);
    setItems(newOrder.map((cat: TPage, index: number) => ({ ...cat, order: index })));
  };

  const deleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const firestore = useFirestore();
  const saveEdits = () => {
    firestore
      .doc('/meta/pages')
      .set(items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}))
      .then(() => setEditMode(false));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar mode="md">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" />
          </IonButtons>
          <IonTitle>
            <FormattedMessage id="private.pages.title" defaultMessage="Pages Content" />
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
                <IonButton routerLink="/settings/pages-content/new">
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
              {items.map(page => (
                <IonItem
                  key={page.id}
                  routerLink={editMode ? undefined : `/settings/pages-content/${encodeURIComponent(page.id)}`}
                  detail={!editMode && isPlatform('ios')}
                >
                  <IonReorder slot="start" />
                  <IonLabel>
                    <h2>{getTitle(page.title)}</h2>
                    <p>{page.id}</p>
                  </IonLabel>
                  {editMode && (
                    <IonButton
                      slot="end"
                      fill="clear"
                      shape="round"
                      color="danger"
                      data-id={page.id}
                      onClick={() => deleteItem(page.id)}
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

export default PagesListPage;
