import React from 'react';
import { useIntl } from 'react-intl';

import AppPage from '../components/AppPage';

const AboutPage: React.FC = () => {
  const intl = useIntl();
  return (
    <AppPage title={intl.formatMessage({ id: 'about.title' })}>
      <div className="ion-padding app-content">
        <h2>About text from the DB</h2>
      </div>
    </AppPage>
  );
};

export default AboutPage;
