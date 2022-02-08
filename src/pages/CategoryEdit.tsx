import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useFirestoreItemQuery } from '../hooks/useFirestoreItemQuery';
import { shallowEqual, useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';

import { getTitle } from '../utils/i18n';

import { IonButton, IonInput, IonItem, IonLabel, IonList } from '@ionic/react';
import TextField from '../components/TextField';
import AppPage from '../components/AppPage';
import { FormattedMessage, useIntl } from 'react-intl';

// types
import { TStoreState } from '../store';
import { TCategory } from '../models/Category';

const newItem = {
  id: '',
  title: '',
  description: '',
  order: 0,
};

const CategoryEditPage: React.FC = () => {
  const intl = useIntl();

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
    <AppPage
      title={item ? getTitle(item.title) : intl.formatMessage({ id: 'private.categories.new.title' })}
      showHeading={true}
      backHref="/settings/categories"
      buttons={
        <IonButton onClick={saveData}>
          <FormattedMessage id="buttons.save" defaultMessage="Save" />
        </IonButton>
      }
    >
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
        <IonItem>
          <TextField
            type="richtext"
            name="content"
            placeholder=""
            value={formData?.description}
            onChange={updateFormData}
            label={
              <>
                <h2>
                  <FormattedMessage id="fields.description.label" defaultMessage="Description" />
                </h2>
                <p>
                  <FormattedMessage
                    id="fields.description.description-category"
                    defaultMessage="Category short description seen on the home page"
                  />
                </p>
              </>
            }
            mono={false}
          />
        </IonItem>{' '}
      </IonList>
    </AppPage>
  );
};

export default CategoryEditPage;
