import React from 'react';
import { useIntl } from 'react-intl';

import AppPage from '../components/AppPage';

import './Contact.css';

const ContactPage: React.FC = () => {
  const intl = useIntl();
  return (
    <AppPage title={intl.formatMessage({ id: 'contact.title' })}>
      <div className="ion-padding app-content">
        <h2>Here's the contact form</h2>
      </div>
    </AppPage>
  );
};

export default ContactPage;
