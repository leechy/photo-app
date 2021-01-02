import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import './HomePage.scss';

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="ion-padding">
          <h1 className="site-title">
            <b>Nataliia</b> Arintcina
            <br />
            <strong>Photography</strong>
            <br />
            Luxembourg
          </h1>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
