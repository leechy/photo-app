import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import AppPage from '../components/AppPage';
import { TStoreState } from '../store';
import { getTitle } from '../utils/i18n';

import './Contact.css';

const ContactPage: React.FC = () => {
  const intl = useIntl();

  const page = useSelector((state: TStoreState) =>
    state.firestore.data?.meta?.pages ? state.firestore.data.meta.pages['/contact'] : null,
  );

  return (
    <AppPage title={intl.formatMessage({ id: 'contact.title' })}>
      <div className="ion-padding app-content">
        {page?.title && <h2>{getTitle(page?.title)}</h2>}
        {page?.content && <div className="page-content" dangerouslySetInnerHTML={{ __html: getTitle(page.content) }} />}
      </div>
    </AppPage>
  );
};

export default ContactPage;
