import React, { useEffect, useState } from 'react';
import { useFirestoreCollectionQuery } from '../hooks/useFirestoreCollectionQuery';
import { useFirestore } from 'react-redux-firebase';
import { getTitle } from '../utils/i18n';

// components
import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonReorder, isPlatform } from '@ionic/react';
import LoadingScreen from '../components/LoadingScreen';
import { FormattedMessage, useIntl } from 'react-intl';
import AppPage from '../components/AppPage';

// types
import { closeCircleOutline } from 'ionicons/icons';
import { TPhotoshoot, TPhotoshootsOrderedState } from '../models/Photoshoot';

const PhotoshootsListPage: React.FC = () => {
  const intl = useIntl();
  /**
   * Items list
   */
  const shoots = useFirestoreCollectionQuery('photoshoots', true, { orderBy: 'id' }) as TPhotoshootsOrderedState;

  const [items, setItems] = useState<TPhotoshoot[]>(shoots.items);
  useEffect(() => {
    if (shoots?.items) {
      setItems(shoots.items);
    }
    // eslint-disable-next-line
  }, [shoots.items]);

  /**
   * Edit mode
   */
  const [editMode, setEditMode] = useState(false);

  const turnOnEditMode = () => {
    setEditMode(true);
  };

  const cancelEditMode = () => {
    setItems(shoots.items);
    setEditMode(false);
  };

  const deleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const firestore = useFirestore();
  const saveEdits = () => {
    firestore
      .doc('/dev/null')
      .set(items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}))
      .then(() => setEditMode(false));
  };

  return (
    <AppPage
      title={intl.formatMessage({ id: 'private.photoshoots.title' })}
      showHeading={true}
      backHref="/settings"
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
            <IonButton routerLink="/settings/photoshoots/new">
              <FormattedMessage id="buttons.add" defaultMessage="Add" />
            </IonButton>
          </>
        )
      }
    >
      {items && items.length ? (
        <IonList>
          {items.map(shoot => (
            <IonItem
              key={shoot.id}
              routerLink={editMode ? undefined : `/settings/photoshoots/${encodeURIComponent(shoot.id)}`}
              detail={!editMode && isPlatform('ios')}
            >
              <IonReorder slot="start" />
              <IonLabel>
                <h2>{getTitle(shoot.title)}</h2>
                <p>{shoot.date}</p>
              </IonLabel>
              {editMode && (
                <IonButton
                  slot="end"
                  fill="clear"
                  shape="round"
                  color="danger"
                  data-id={shoot.id}
                  onClick={() => deleteItem(shoot.id)}
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

export default PhotoshootsListPage;
