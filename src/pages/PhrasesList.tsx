import React, { useEffect, useState } from 'react';
import { useFirestoreItemQuery } from '../hooks/useFirestoreItemQuery';
import { useFirestore } from 'react-redux-firebase';
import { shallowEqual, useSelector } from 'react-redux';

// components
import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonReorder, isPlatform } from '@ionic/react';
import LoadingScreen from '../components/LoadingScreen';
import { FormattedMessage, useIntl } from 'react-intl';
import AppPage from '../components/AppPage';

// types
import { closeCircleOutline } from 'ionicons/icons';
import { TMessage } from '../models/Message';
import { TStoreState } from '../store';

const PhrasesListPage: React.FC = () => {
  const intl = useIntl();

  /**
   * Languages
   */
  const langs = useSelector((state: TStoreState) => state.firestore.data?.translations?.locales, shallowEqual);

  /**
   * Items list
   */
  const messages = useFirestoreItemQuery('translations', 'messages');
  const [items, setItems] = useState<TMessage[]>(
    messages?.item
      ? Object.keys(messages.item)
          .map((msgId: string) => messages.item[msgId])
          .sort((item1, item2) => (item1.id > item2.id ? 1 : -1))
      : [],
  );
  useEffect(() => {
    if (messages?.item) {
      setItems(
        Object.keys(messages.item)
          .map((msgId: string) => messages.item[msgId])
          .sort((item1, item2) => (item1.id > item2.id ? 1 : -1)),
      );
    }
    // eslint-disable-next-line
  }, [messages.item]);

  /**
   * Edit mode
   */
  const [editMode, setEditMode] = useState(false);

  const turnOnEditMode = () => {
    setEditMode(true);
  };

  const cancelEditMode = () => {
    setItems(
      Object.keys(messages.item)
        .map((msgId: string) => messages.item[msgId])
        .sort((item1, item2) => (item1.id > item2.id ? 1 : -1)),
    );
    setEditMode(false);
  };

  const deleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const firestore = useFirestore();
  const saveEdits = () => {
    firestore
      .doc('/translations/messages')
      .set(items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}))
      .then(() => setEditMode(false));
  };

  return (
    <AppPage
      title={intl.formatMessage({ id: 'private.phrases.title' })}
      showHeading={true}
      backHref="/settings/translations"
      buttons={
        editMode ? (
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
            <IonButton routerLink="/settings/translations/phrases/new">
              <FormattedMessage id="buttons.add" defaultMessage="Add" />
            </IonButton>
          </>
        )
      }
    >
      {items.length ? (
        <IonList>
          {items.map(message => (
            <IonItem
              key={message.id}
              routerLink={editMode ? undefined : `/settings/translations/phrases/${message.id}`}
              detail={!editMode && isPlatform('ios')}
            >
              <IonReorder slot="start" />
              <IonLabel>
                <h2>{message.id}</h2>
                <p>{message.description}</p>
              </IonLabel>
              {message.phrases && typeof message.phrases !== 'string' && (
                <div className="item--end-state" slot="end">
                  {langs &&
                    Object.keys(langs)
                      .sort((lang1, lang2) => (langs[lang1].order > langs[lang2].order ? 1 : -1))
                      .map(langCode => (
                        <span
                          key={`${message.id}-${langCode}`}
                          className={
                            typeof message.phrases === 'string' ||
                            !message.phrases ||
                            !message.phrases[langCode] ||
                            message.phrases[langCode] === ''
                              ? 'item--end-state-na'
                              : ''
                          }
                        >
                          {langCode.toUpperCase()}
                        </span>
                      ))}
                </div>
              )}
              {editMode && (
                <IonButton
                  slot="end"
                  fill="clear"
                  shape="round"
                  color="danger"
                  data-id={message.id}
                  onClick={() => deleteItem(message.id)}
                >
                  <IonIcon slot="icon-only" icon={closeCircleOutline} />
                </IonButton>
              )}
            </IonItem>
          ))}
        </IonList>
      ) : (
        <LoadingScreen />
      )}
    </AppPage>
  );
};

export default PhrasesListPage;
