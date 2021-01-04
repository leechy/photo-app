import React from 'react';
import { IonItem, IonItemGroup, IonLabel, IonList } from '@ionic/react';
import { FormattedMessage, useIntl } from 'react-intl';
import AppPage from '../components/AppPage';

const TranslationsPage: React.FC = () => {
  const intl = useIntl();

  return (
    <AppPage title={intl.formatMessage({ id: 'private.translations.title' })} showHeading={true} backHref="/settings">
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
    </AppPage>
  );
};

export default TranslationsPage;
