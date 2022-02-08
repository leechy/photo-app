import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

import { useHistory, useParams } from 'react-router';
import { useFirestoreItemQuery } from '../hooks/useFirestoreItemQuery';
import { useFirestore } from 'react-redux-firebase';

import {
  IonButton,
  IonCheckbox,
  IonDatetime,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import TextField from '../components/TextField';
import { FormattedMessage, useIntl } from 'react-intl';
import AppPage from '../components/AppPage';

// types
import { TStoreState } from '../store';
import { TPhotoshoot, TPhotoshootState } from '../models/Photoshoot';
import { getTitle } from '../utils/i18n';
import { TCategory } from '../models/Category';

const newItem = {
  id: '',
  date: {
    date: new Date().toISOString().substr(0, 10),
  },
};

const PhotoshootEditPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();

  const intl = useIntl();

  const photoshoot = useFirestoreItemQuery('photoshoots', itemId) as TPhotoshootState;

  // form data
  const [formData, setFormData] = useState<TPhotoshoot>(photoshoot.item || newItem);
  useEffect(() => {
    if (photoshoot?.item?.id) {
      console.log('item', photoshoot.item);
      setFormData({ ...photoshoot.item });
    }
  }, [photoshoot.item]);

  const updateFormData = (evt: any) => {
    setFormData(data => ({
      ...data,
      [evt.target.name]: evt.target.checked === undefined ? evt.target.value : evt.target.checked,
    }));
  };

  const updateSelectValue = (evt: any) => {
    setFormData(data => ({
      ...data,
      [evt.target.name]: evt.detail.value,
    }));
  };

  const updateSubField = (fieldName: 'date', subField: string, value: any) => {
    setFormData(data => ({
      ...data,
      [fieldName]: {
        ...data[fieldName],
        [subField]: value,
      },
    }));
  };

  // categories
  const categories = useFirestoreItemQuery('meta', 'categories');
  const [cats, setCats] = useState<TCategory[]>(
    categories?.item
      ? Object.keys(categories.item)
          .map((catId: string) => categories.item[catId])
          .sort((item1, item2) => (item1.order > item2.order ? 1 : -1))
      : [],
  );
  useEffect(() => {
    if (categories?.item) {
      setCats(
        Object.keys(categories.item)
          .map((catId: string) => categories.item[catId])
          .sort((item1, item2) => (item1.order > item2.order ? 1 : -1)),
      );
    }
    // eslint-disable-next-line
  }, [categories.item]);

  // saving data
  const firestore = useFirestore();
  const history = useHistory();
  const saveData = () => {
    const newItemId = itemId === 'new' ? nanoid(14) : itemId;
    formData.id = newItemId;

    firestore.doc(`/photoshoots/${newItemId}`).set(formData);
  };

  return (
    <AppPage
      title={getTitle(formData.title) || intl.formatMessage({ id: 'private.photoshoot.new.title' })}
      showHeading={true}
      backHref="/settings/photoshoots"
      buttons={
        <IonButton onClick={saveData}>
          <FormattedMessage id="buttons.save" defaultMessage="Save" />
        </IonButton>
      }
    >
      <IonList>
        <IonItem>
          <TextField
            type="text"
            name="title"
            placeholder=""
            value={formData?.title}
            onChange={updateFormData}
            label={intl.formatMessage({ id: 'fields.title.label', defaultMessage: 'Title' })}
            mono={false}
          />
        </IonItem>
        <IonItem>
          <IonLabel>
            <h2>
              <FormattedMessage id="fields.date.label" defaultMessage="Date" />
            </h2>
          </IonLabel>
          <IonDatetime
            displayFormat="DD/MM/YYYY"
            min="2000-01-01"
            value={formData?.date?.date}
            onIonChange={e => updateSubField('date', 'date', e.detail.value!.substr(0, 10))}
          />
        </IonItem>
        <IonItem>
          <IonLabel>
            <h2>
              <FormattedMessage id="fields.range.label" defaultMessage="Date" />
            </h2>
          </IonLabel>
          <IonCheckbox
            slot="end"
            checked={formData?.date?.range}
            onIonChange={e => updateSubField('date', 'range', e.detail.checked)}
          />
        </IonItem>
        <IonItem>
          <IonLabel>
            <h2>
              <FormattedMessage id="fields.category.label" defaultMessage="Category" />
            </h2>
          </IonLabel>
          <IonSelect
            name="category"
            value={formData?.category}
            onIonChange={updateSelectValue}
            interface="action-sheet"
          >
            {cats.map(cat => (
              <IonSelectOption key={cat.id} value={cat.id}>
                {getTitle(cat.title)}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      </IonList>
    </AppPage>
  );
};

export default PhotoshootEditPage;
