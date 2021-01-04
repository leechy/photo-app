import React, { ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';
import { useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react';

// components
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Helmet } from 'react-helmet';

// types
import { TStoreState } from '../store';
import { getTitle } from '../utils/i18n';
// import { useLocation } from 'react-router';

type TAppPageProps = {
  title?: string;
  showHeading?: boolean;
  backHref?: string;
  buttons?: ReactNode;
  children?: ReactNode;
};

const AppPage = ({ showHeading = false, title = '', backHref, buttons, children }: TAppPageProps): JSX.Element => {
  const app = useSelector((state: TStoreState) => state.firestore.data?.meta?.app);

  // const location = useLocation();
  // console.log('app page location', location.pathname);

  const pageTitle = (title !== '' ? title + ' · ' : '') + (app?.name ? getTitle(app.name) : '');

  const [showTitle, setShowTitle] = useState(false);

  useIonViewWillEnter(() => {
    setShowTitle(true);
  });

  useIonViewWillLeave(() => {
    setShowTitle(false);
  });

  return (
    <IonPage>
      {showTitle && pageTitle !== '' && (
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
      )}
      {showHeading && title && (
        <IonHeader>
          <IonToolbar>
            {backHref && (
              <IonButtons slot="start">
                <IonBackButton defaultHref={backHref} />
              </IonButtons>
            )}
            <IonTitle>{title}</IonTitle>
            {buttons && <IonButtons slot="end">{buttons}</IonButtons>}
          </IonToolbar>
        </IonHeader>
      )}
      <IonContent fullscreen>{children}</IonContent>
    </IonPage>
  );
};

export default AppPage;
