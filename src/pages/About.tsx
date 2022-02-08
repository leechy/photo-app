import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import AppPage from '../components/AppPage';
import { TStoreState } from '../store';
import { getTitle } from '../utils/i18n';

const AboutPage: React.FC = () => {
  const intl = useIntl();

  const page = useSelector((state: TStoreState) =>
    state.firestore.data?.meta?.pages ? state.firestore.data.meta.pages['/about'] : null,
  );

  return (
    <AppPage title={intl.formatMessage({ id: 'about.title' })}>
      <div className="ion-padding app-content">
        {page?.title && <h2>{getTitle(page?.title)}</h2>}

        <div className="photo-in-a-hole" style={{ backgroundImage: '/assets/demo/sqr3.jpg' }}></div>

        {page?.content && <div className="page-content" dangerouslySetInnerHTML={{ __html: getTitle(page.content) }} />}
      </div>
    </AppPage>
  );
};

export default AboutPage;
