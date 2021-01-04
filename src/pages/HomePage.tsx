import React from 'react';
import { useSelector } from 'react-redux';

import AppPage from '../components/AppPage';

import { TStoreState } from '../store';
import { getTitle } from '../utils/i18n';

import './HomePage.scss';

const HomePage: React.FC = () => {
  const app = useSelector((state: TStoreState) => state.firestore.data?.meta?.app);

  return (
    <AppPage>
      <div className="ion-padding app-content">
        {app && app.title && <div className="site-title" dangerouslySetInnerHTML={{ __html: getTitle(app.title) }} />}
      </div>
    </AppPage>
  );
};

export default HomePage;
