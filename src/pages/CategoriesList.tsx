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
import { TCategory } from '../models/Category';

const CategoriesListPage: React.FC = () => {
  /**
   * Items list
   */
  const categories = useFirestoreItemQuery('meta', 'categories');
  const [items, setItems] = useState<TCategory[]>(
    categories?.item
      ? Object.keys(categories.item)
          .map((catId: string) => categories.item[catId])
          .sort((item1, item2) => (item1.order > item2.order ? 1 : -1))
      : [],
  );
  useEffect(() => {
    if (categories?.item) {
      setItems(
        Object.keys(categories.item)
          .map((catId: string) => categories.item[catId])
          .sort((item1, item2) => (item1.order > item2.order ? 1 : -1)),
      );
    }
    // eslint-disable-next-line
  }, [categories.item]);

  /**
   * Edit mode
   */
  const [editMode, setEditMode] = useState(false);

  const turnOnEditMode = () => {
    setEditMode(true);
  };

  const cancelEditMode = () => {
    setItems(
      Object.keys(categories.item)
        .map((catId: string) => categories.item[catId])
        .sort((item1, item2) => (item1.order > item2.order ? 1 : -1)),
    );
    setEditMode(false);
  };

  const onReorder = (evt: CustomEvent<ItemReorderEventDetail>) => {
    const newOrder = evt.detail.complete(items);
    setItems(newOrder.map((cat: TCategory, index: number) => ({ ...cat, order: index })));
  };

  const deleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const firestore = useFirestore();
  const saveEdits = () => {
    firestore
      .doc('/meta/categories')
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
            <FormattedMessage id="private.categories.title" defaultMessage="Categories" />
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
                <IonButton routerLink="/settings/categories/new">
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
              {items.map(cat => (
                <IonItem
                  key={cat.id}
                  routerLink={editMode ? undefined : `/settings/categories/${cat.id}`}
                  detail={!editMode && isPlatform('ios')}
                >
                  <IonReorder slot="start" />
                  <IonLabel>
                    <h2>{getTitle(cat.title)}</h2>
                    <p>{cat.id}</p>
                  </IonLabel>
                  {editMode && (
                    <IonButton
                      slot="end"
                      fill="clear"
                      shape="round"
                      color="danger"
                      data-id={cat.id}
                      onClick={() => deleteItem(cat.id)}
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

export default CategoriesListPage;
