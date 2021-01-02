import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useFirestoreItemQuery } from '../hooks/useFirestoreItemQuery';
import { shallowEqual, useSelector } from 'react-redux';

import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
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
import { TStoreState } from '../store';
import { TLang } from '../models/Lang';
import { useFirestore } from 'react-redux-firebase';
import { FormattedMessage } from 'react-intl';

const newLang = {
  code: '',
  title: '',
  active: false,
  order: 0,
};

const LanguagEditPage: React.FC = () => {
  const { langId } = useParams<{ langId: string }>();
  useFirestoreItemQuery('translations', 'locales');

  const locales = useSelector((state: TStoreState) => state.firestore.data?.translations?.locales, shallowEqual);

  const [lang, setLang] = useState(locales ? locales[langId] : newLang);
  useEffect(() => {
    if (locales && locales[langId]) {
      setLang(locales[langId]);
    }
  }, [locales, langId]);

  // form data
  const [formData, setFormData] = useState<TLang>(lang || newLang);
  useEffect(() => {
    if (lang?.code) {
      setFormData({ ...lang });
    }
  }, [lang]);

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
    if (formData.code === '') {
      return;
    }
    if (langId !== 'new' && langId !== formData.code) {
      // lang id was changed
      const newLocales = { ...locales };
      if (newLocales[langId]) {
        delete newLocales[langId];
      }
      newLocales[formData.code] = formData;
      firestore
        .doc('/translations/locales')
        .set(newLocales)
        .then(() => goToParent());
    } else {
      if (langId === 'new') {
        // set the last order value
        formData.order = Object.keys(locales!).length;
      }
      firestore
        .doc('/translations/locales')
        .set({ [formData.code]: formData }, { merge: true })
        .then(() => goToParent());
    }
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
            <IonBackButton defaultHref="/settings/translations/languages" />
          </IonButtons>
          <IonTitle>
            {lang ? lang.title : <FormattedMessage id="private.languages.new.title" defaultMessage="New Language" />}
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
                <FormattedMessage id="fields.lang-code.label" defaultMessage="Code" />
              </h2>
              <p>
                <FormattedMessage id="fields.lang-code.description" defaultMessage="ICU locale code" />
              </p>
            </IonLabel>
            <IonInput
              className="text-input"
              name="code"
              data-lpignore="true"
              value={formData?.code}
              onIonInput={updateFormData}
              placeholder="en, pt-BR"
            />
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>
                <FormattedMessage id="fields.title.label" defaultMessage="Title" />
              </h2>
              <p>
                <FormattedMessage id="fields.title.language.description" defaultMessage="Language name" />
              </p>
            </IonLabel>
            <IonInput
              className="text-input"
              name="title"
              value={formData?.title}
              onIonInput={updateFormData}
              placeholder="English, Français"
            />
          </IonItem>
          <IonItem>
            <IonCheckbox slot="end" name="active" onIonChange={updateFormData} checked={formData?.active} />
            <IonLabel>
              <h2>
                <FormattedMessage id="fields.active.label" defaultMessage="Active" />
              </h2>
              <p>
                <FormattedMessage
                  id="fields.active.language.description"
                  defaultMessage="Is this language available to the users"
                />
              </p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default LanguagEditPage;
