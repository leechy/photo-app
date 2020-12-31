import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useFirestoreItemQuery } from '../hooks/useFirestoreItemQuery';
import { shallowEqual, useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';

import { getTitle } from '../utils/i18n';

import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import TextField from '../components/TextField';

// types
import { TStoreState } from '../store';
import { TCategory } from '../models/Category';
import { FormattedMessage } from 'react-intl';

const newItem = {
  id: '',
  title: '',
  order: 0,
};

const CategoryEditPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  useFirestoreItemQuery('meta', 'categories');

  const items = useSelector((state: TStoreState) => state.firestore.data?.meta?.categories, shallowEqual);

  const [item, setItem] = useState(items ? items[itemId] : newItem);
  useEffect(() => {
    if (items && items[itemId]) {
      setItem(items[itemId]);
    }
  }, [items, itemId]);

  // form data
  const [formData, setFormData] = useState<TCategory>(item || newItem);
  useEffect(() => {
    if (item?.id) {
      setFormData({ ...item });
    }
  }, [item]);

  const updateFormData = (evt: any) => {
    setFormData(data => ({
      ...data,
      [evt.target.name]: evt.target.checked === undefined ? evt.target.value : evt.target.checked,
    }));
  };

  // saving data
  const firestore = useFirestore();
  const history = useHistory();
  const saveData = () => {
    if (formData.id === '') {
      return;
    }
    if (itemId !== 'new' && itemId !== formData.id) {
      // lang id was changed
      const newItems = { ...items };
      if (newItems[itemId]) {
        delete newItems[itemId];
      }
      newItems[formData.id] = formData;
      firestore
        .doc('/meta/categories')
        .set(newItems)
        .then(() => goToParent());
    } else {
      if (itemId === 'new') {
        // set the last order value
        formData.order = Object.keys(items!).length;
      }
      firestore
        .doc('/meta/categories')
        .set({ [formData.id]: formData }, { merge: true })
        .then(() => goToParent());
    }
  };

  const goToParent = () => {
    if (history.length > 2) {
      history.goBack();
    } else {
      history.replace('/settings/categories');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar mode="md">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings/categories" />
          </IonButtons>
          <IonTitle>
            {item ? (
              getTitle(item.title)
            ) : (
              <FormattedMessage id="private.categories.new.title" defaultMessage="New Category" />
            )}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={saveData}>
              <FormattedMessage id="buttons.save" defaultMessage="Save" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>
              <h2>
                <FormattedMessage id="fields.path.label" defaultMessage="Path" />
              </h2>
              <p>
                <FormattedMessage id="fields.path.description" defaultMessage="Identifier used in the page path" />
              </p>
            </IonLabel>
            <IonInput
              className="text-input"
              name="id"
              data-lpignore="true"
              value={formData?.id}
              onIonInput={updateFormData}
              placeholder="weddings, anniversaries"
            />
          </IonItem>
          <IonItem>
            <TextField
              type="text"
              name="title"
              placeholder=""
              value={formData?.title}
              onChange={updateFormData}
              label={
                <>
                  <h2>
                    <FormattedMessage id="fields.title.label" defaultMessage="Title" />
                  </h2>
                  <p>
                    <FormattedMessage id="fields.title.description-plural" defaultMessage="Name in all languages" />
                  </p>
                </>
              }
              mono={false}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CategoryEditPage;
