import { IonIcon, IonImg, IonSlide, IonSlides } from '@ionic/react';
import { logoFacebook, logoInstagram, logoTwitter } from 'ionicons/icons';
import React from 'react';
import { useSelector } from 'react-redux';

import AppPage from '../components/AppPage';

import { TStoreState } from '../store';
import { getTitle } from '../utils/i18n';

import './HomePage.scss';

const HomePage: React.FC = () => {
  const app = useSelector((state: TStoreState) => state.firestore.data?.meta?.app);

  const slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoplay: {
      delay: 5000,
    },
    loop: true,
  };

  return (
    <AppPage>
      <div className="ion-padding app-content">
        <div className="site-social">
          {app?.instagram && (
            <a href={app.instagram} target="_blank" rel="noopener noreferrer">
              <IonIcon icon={logoInstagram} size="large" title="Instagram" />
            </a>
          )}
          {app?.facebook && (
            <a href={app.facebook} target="_blank" rel="noopener noreferrer">
              <IonIcon icon={logoFacebook} size="large" title="Facebook" />
            </a>
          )}
          {app?.twitter && (
            <a href={app.twitter} target="_blank" rel="noopener noreferrer">
              <IonIcon icon={logoTwitter} size="large" title="Twitter" />
            </a>
          )}
        </div>

        {app?.title && <div className="site-title" dangerouslySetInnerHTML={{ __html: getTitle(app.title) }} />}

        <div className="slides--container">
          <IonSlides className="slides" pager={true} options={slideOpts}>
            <IonSlide className="slides--slide">
              <IonImg className="slides--image" src="/assets/demo/hrz3.jpg" />
            </IonSlide>
            <IonSlide className="slides--slide">
              <IonImg className="slides--image" src="/assets/demo/hrz1.jpg" />
            </IonSlide>
            <IonSlide className="slides--slide">
              <IonImg className="slides--image" src="/assets/demo/hrz4.jpg" />
            </IonSlide>
          </IonSlides>
        </div>

        <div className="photo-in-a-hole" style={{ backgroundImage: '/assets/demo/sqr3.jpg' }}></div>
      </div>
    </AppPage>
  );
};

export default HomePage;
