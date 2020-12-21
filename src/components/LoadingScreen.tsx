import React from 'react';
import { IonSpinner } from '@ionic/react';

import './LoadingScreen.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <IonSpinner />
    </div>
  );
};

export default LoadingScreen;
