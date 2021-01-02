import React from 'react';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { FormattedMessage } from 'react-intl';

const TranslationsPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar mode="md">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" />
          </IonButtons>
          <IonTitle>
            <FormattedMessage id="private.translations.title" defaultMessage="Translations" />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItemGroup>
            <IonItem routerLink="/settings/translations/languages">
              <IonLabel>
                <h2>
                  <FormattedMessage id="private.languages.title" defaultMessage="Languages" />
                </h2>
                <p>
                  <FormattedMessage
                    id="private.languages.description"
                    defaultMessage="Add new languages, change currently available"
                  />
                </p>
              </IonLabel>
            </IonItem>
            <IonItem routerLink="/settings/translations/phrases">
              <IonLabel>
                <h2>
                  <FormattedMessage id="private.phrases.title" defaultMessage="Phrases" />
                </h2>
                <p>
                  <FormattedMessage
                    id="private.phrases.description"
                    defaultMessage="Change all labels and phrases used in the interface"
                  />
                </p>
              </IonLabel>
            </IonItem>
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default TranslationsPage;
