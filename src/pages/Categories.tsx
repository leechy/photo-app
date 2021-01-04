import React, { useEffect, useState } from 'react';
import { useFirestoreItemQuery } from '../hooks/useFirestoreItemQuery';
import { useIntl } from 'react-intl';
import { getTitle } from '../utils/i18n';

import LoadingScreen from '../components/LoadingScreen';
import AppPage from '../components/AppPage';

import { TCategory } from '../models/Category';
import './Categories.css';

const CategoriesPage: React.FC = () => {
  const intl = useIntl();

  /**
   * Items list
   */
  const categories = useFirestoreItemQuery('meta', 'categories');
  const [items, setItems] = useState<TCategory[]>(
    categories?.item
      ? Object.keys(categories.item)
          .map((catId: string) => categories.item[catId])
          .sort((item1, item2) => (item1.order > item2.order ? 1 : -1))
      : [],
  );
  useEffect(() => {
    if (categories?.item) {
      setItems(
        Object.keys(categories.item)
          .map((catId: string) => categories.item[catId])
          .sort((item1, item2) => (item1.order > item2.order ? 1 : -1)),
      );
    }
    // eslint-disable-next-line
  }, [categories.item]);

  return (
    <AppPage title={intl.formatMessage({ id: 'categories.title' })}>
      <div className="ion-padding app-content">
        {items ? (
          <>
            {items.map(item => (
              <div key={item.id}>
                <h3>{getTitle(item.title)}</h3>
              </div>
            ))}
          </>
        ) : (
          <LoadingScreen />
        )}
      </div>
    </AppPage>
  );
};

export default CategoriesPage;
