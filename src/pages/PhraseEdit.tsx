import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useFirestoreItemQuery } from '../hooks/useFirestoreItemQuery';
import { shallowEqual, useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';

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
import { FormattedMessage, useIntl } from 'react-intl';

// types
import { TStoreState } from '../store';
import { TMessage } from '../models/Message';
import { compileTranslations, extractLangPhrases } from '../utils/translations';

const newItem = {
  id: '',
  description: '',
  phrases: '',
};

const PhraseEditPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();

  const intl = useIntl();

  useFirestoreItemQuery('translations', 'messages');

  const items = useSelector((state: TStoreState) => state.firestore.data?.translations?.messages, shallowEqual);

  const [item, setItem] = useState(items ? items[itemId] : newItem);
  useEffect(() => {
    if (items && items[itemId]) {
      setItem(items[itemId]);
    }
  }, [items, itemId]);

  // form data
  const [formData, setFormData] = useState<TMessage>(item || newItem);
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

    const updatedItems = { ...items };
    if (itemId !== 'new' && itemId !== formData.id) {
      // item id was changed
      if (updatedItems[itemId]) {
        delete updatedItems[itemId];
      }
    }
    updatedItems[formData.id] = formData;
    firestore
      .doc('/translations/messages')
      .set(updatedItems)
      .then(() => goToParent());

    // compile translations
    updateTranslations(updatedItems);
  };

  const goToParent = () => {
    if (history.length > 2) {
      history.goBack();
    } else {
      history.replace('/settings/translations/phrases');
    }
  };

  /**
   * Compile translations
   */
  const langs = useSelector((state: TStoreState) => state.firestore.data?.translations?.locales, shallowEqual);
  const updateTranslations = (updatedItems: { [msgId: string]: TMessage }) => {
    if (langs) {
      Object.keys(langs).forEach(langId => {
        const phrases = extractLangPhrases(updatedItems, langId);
        const compiled = compileTranslations(phrases);
        firestore.doc(`/translations/${langId}`).set(compiled);
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar mode="md">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings/translations/phrases" />
          </IonButtons>
          <IonTitle>
            {item?.id || <FormattedMessage id="private.phrases.new.title" defaultMessage="New Message" />}
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
                <FormattedMessage id="fields.identifier.label" defaultMessage="Identifier" />
              </h2>
              <p>
                <FormattedMessage id="fields.identifier.phrase.description" defaultMessage="String used in the code" />
              </p>
            </IonLabel>
            <IonInput
              className="text-input"
              name="id"
              data-lpignore="true"
              value={formData?.id}
              onIonInput={updateFormData}
              placeholder="menu.home, about.title"
            />
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>
                <FormattedMessage id="fields.description.label" defaultMessage="Description" />
              </h2>
              <p>
                <FormattedMessage
                  id="fields.description.phrase.description"
                  defaultMessage="Where the phrase is used"
                />
              </p>
            </IonLabel>
            <IonInput
              className="text-input"
              name="description"
              data-lpignore="true"
              value={formData?.description}
              onIonInput={updateFormData}
              placeholder="Menu item, Page title"
            />
          </IonItem>
          <IonItem>
            <TextField
              type="text"
              name="phrases"
              placeholder=""
              value={formData?.phrases}
              onChange={updateFormData}
              label={intl.formatMessage({ id: 'fields.phrases.label', defaultMessage: 'Translated Phrases' })}
              mono={false}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default PhraseEditPage;
