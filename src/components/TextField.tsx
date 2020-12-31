import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

// components
import { IonInput, IonLabel } from '@ionic/react';

// types
import { TLangString } from '../models/LangString';
import { TStoreState } from '../store';

import './TextField.scss';
import RichTextField from './RichTextField';

type TextFieldProps = {
  label?: string | React.ReactElement;
  value: TLangString;
  type?: 'number' | 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'richtext' | undefined;
  name: string;
  placeholder?: string;
  onChange: (evt: any) => void;
  mono?: boolean;
};

const TextField = ({ label, value = '', name, type = 'text', placeholder, onChange, mono = true }: TextFieldProps) => {
  const langs = useSelector((state: TStoreState) => state.firestore.data?.translations?.locales, shallowEqual);

  const onInput = (evt: any) => {
    if (mono) {
      onChange({ target: { name, value: evt?.target?.value } });
    } else {
      const lang = evt.target.name.substr(name.length + 1);
      onChange({
        target: {
          name,
          value: {
            ...(typeof value === 'string' ? {} : value),
            [lang]: evt.target.value,
          },
        },
      });
    }
  };

  return (
    <>
      {label && (
        <IonLabel className="text-field--main-label" position="stacked">
          {label}
        </IonLabel>
      )}
      <div className="text-field">
        {!mono &&
          langs &&
          Object.keys(langs)
            .sort((lang1, lang2) => (langs[lang1].order > langs[lang2].order ? 1 : -1))
            .map(langId => (
              <div className="text-field--labeled-input" key={`text-field-${name}-${langId}`}>
                <h3 className={`text-field--label ${langs[langId].active ? '' : 'text-field--label-inactive'}`}>
                  {langs[langId].title || langId}
                </h3>
                {type === 'richtext' ? (
                  <RichTextField
                    value={typeof value === 'string' ? value : value[langId]}
                    onChange={(evt: string) => {
                      onInput({ target: { name: `${name}-${langId}`, value: evt } });
                    }}
                  />
                ) : (
                  <IonInput
                    name={`${name}-${langId}`}
                    type={type}
                    placeholder={placeholder}
                    onIonInput={onInput}
                    value={typeof value === 'string' ? value : value[langId]}
                  />
                )}
              </div>
            ))}
        {mono && type !== 'richtext' && (
          <IonInput
            name={name}
            type={type}
            placeholder={placeholder}
            onIonInput={onInput}
            value={typeof value === 'string' ? value : value.en}
          />
        )}
      </div>
    </>
  );
};

export default TextField;
