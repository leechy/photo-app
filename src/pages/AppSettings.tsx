import React, { useEffect, useState } from 'react';
import { useFirestoreItemQuery } from '../hooks/useFirestoreItemQuery';
import { shallowEqual, useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { useHistory } from 'react-router';

import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import TextField from '../components/TextField';
import { FormattedMessage, useIntl } from 'react-intl';

import { TStoreState } from '../store';
import { TAppData } from '../models/AppData';

const newData: TAppData = {
  name: '',
  title: '',
};

const AppSettingsPage: React.FC = () => {
  const intl = useIntl();
  useFirestoreItemQuery('meta', 'app');

  const data = useSelector((state: TStoreState) => state.firestore.data?.meta?.app, shallowEqual) as TAppData;

  // form data
  const [formData, setFormData] = useState<TAppData>(data || newData);
  useEffect(() => {
    setFormData({ ...data });
  }, [data]);

  const updateFormData = (evt: any) => {
    setFormData(data => ({
      ...data,
      [evt.target.name]: evt.target.checked === undefined ? evt.target.value : evt.target.checked,
    }));
  };

  const firestore = useFirestore();
  const history = useHistory();
  const saveData = () => {
    firestore
      .doc('/meta/app')
      .set(formData, { merge: true })
      .then(() => goToParent());
  };

  const goToParent = () => {
    if (history.length > 2) {
      history.goBack();
    } else {
      history.replace('/settings/translations/languages');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar mode="md">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" />
          </IonButtons>
          <IonTitle>
            <FormattedMessage id="private.app-settings.title" defaultMessage="General Settings" />
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={saveData}>
              <FormattedMessage id="buttons.save" defaultMessage="Save" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <TextField
              type="text"
              name="name"
              placeholder={intl.formatMessage({
                id: 'fields.app-name.placeholder',
                defaultMessage: 'App title and title suffix',
              })}
              value={formData?.name}
              onChange={updateFormData}
              label={
                <h2>
                  <FormattedMessage id="fields.app-name.label" defaultMessage="Application Name" />
                </h2>
              }
              mono={false}
            />
          </IonItem>
          <IonItem>
            <TextField
              type="richtext"
              name="title"
              placeholder=""
              value={formData?.title}
              onChange={updateFormData}
              label={intl.formatMessage({ id: 'fields.app-title.label', defaultMessage: 'Home Page Heading' })}
              mono={false}
            />
          </IonItem>
          <IonItem>
            <TextField
              type="text"
              name="instagram"
              placeholder="https://www.instagram.com/..."
              value={formData?.instagram}
              onChange={updateFormData}
              label="Instagram"
            />
          </IonItem>
          <IonItem>
            <TextField
              type="text"
              name="facebook"
              placeholder="https://www.facebook.com/..."
              value={formData?.facebook}
              onChange={updateFormData}
              label="Facebook"
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AppSettingsPage;
