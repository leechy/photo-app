import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useFirestoreItemQuery } from '../hooks/useFirestoreItemQuery';
import { shallowEqual, useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';

import { getTitle } from '../utils/i18n';

import { IonButton, IonInput, IonItem, IonLabel, IonList } from '@ionic/react';
import TextField from '../components/TextField';
import { FormattedMessage, useIntl } from 'react-intl';
import AppPage from '../components/AppPage';

// types
import { TStoreState } from '../store';
import { TPage } from '../models/Page';

const newItem = {
  id: '',
  title: '',
  order: 0,
  content: '',
};

const PageEditPage: React.FC = () => {
  const intl = useIntl();

  let { itemId } = useParams<{ itemId: string }>();
  itemId = decodeURIComponent(itemId);
  useFirestoreItemQuery('meta', 'pages');

  const items = useSelector((state: TStoreState) => state.firestore.data?.meta?.pages, shallowEqual);

  const [item, setItem] = useState(items ? items[itemId] : newItem);
  useEffect(() => {
    if (items && items[itemId]) {
      setItem(items[itemId]);
    }
  }, [items, itemId]);

  // form data
  const [formData, setFormData] = useState<TPage>(item || newItem);
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
      // item id was changed
      const newItems = { ...items };
      if (newItems[itemId]) {
        delete newItems[itemId];
      }
      newItems[formData.id] = formData;
      firestore
        .doc('/meta/pages')
        .set(newItems)
        .then(() => goToParent());
    } else {
      if (itemId === 'new') {
        // set the last order value
        formData.order = Object.keys(items!).length;
      }
      firestore
        .doc('/meta/pages')
        .set({ [formData.id]: formData }, { merge: true })
        .then(() => goToParent());
    }
  };

  const goToParent = () => {
    if (history.length > 2) {
      history.goBack();
    } else {
      history.replace('/settings/pages-content');
    }
  };

  return (
    <AppPage
      title={item ? getTitle(item.title) : intl.formatMessage({ id: 'private.phrases.new.title' })}
      showHeading={true}
      backHref="/settings/pages-content"
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
            placeholder="/about, /contact"
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
            value={formData?.content}
            onChange={updateFormData}
            label={
              <>
                <h2>
                  <FormattedMessage id="fields.content.label" defaultMessage="Content" />
                </h2>
                <p>
                  <FormattedMessage
                    id="fields.content.description-plural"
                    defaultMessage="Custom text in all languages"
                  />
                </p>
              </>
            }
            mono={false}
          />
        </IonItem>
      </IonList>
    </AppPage>
  );
};

export default PageEditPage;
