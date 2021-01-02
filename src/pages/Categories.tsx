import React, { useEffect, useState } from 'react';
import { useFirestoreItemQuery } from '../hooks/useFirestoreItemQuery';

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import LoadingScreen from '../components/LoadingScreen';

import { TCategory } from '../models/Category';
import './Categories.css';
import { getTitle } from '../utils/i18n';

const CategoriesPage: React.FC = () => {
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Categories</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="ion-padding">
          {items ? (
            <>
              {items.map(item => (
                <div key={item.id}>
                  <h3>{getTitle(item.title)}</h3>
                </div>
              ))}
            </>
          ) : (
            <LoadingScreen />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CategoriesPage;
