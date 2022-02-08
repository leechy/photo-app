// second link to Firebase to create user in parallel
import fb from 'firebase/app';

// hooks
import { FormEvent, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';

// components
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import TextField from './TextField';

// icons
import { closeOutline } from 'ionicons/icons';

// types
import { TStoreState } from '../store';
import React from 'react';

type TAuthModalProps = {
  isOpen: boolean;
  onDidDismiss: () => void;
};

const LoginPopup: React.FC<TAuthModalProps> = (props: TAuthModalProps) => {
  const routerRef = useSelector((state: any) => state.ui?.routerRef);
  const user = useSelector((state: TStoreState) => state.firebase?.auth, shallowEqual);

  const intl = useIntl();

  const firebase = useFirebase();

  const [currentAuthForm] = useState<string | undefined>('login');

  const processForm = (evt: FormEvent) => {
    evt.defaultPrevented = true;
    evt.preventDefault();
    evt.stopPropagation();
    authAction();
  };

  // form data
  const email = useRef('');
  const password = useRef('');

  const authAction = () => {
    clearErrors();

    console.log('authAction', currentAuthForm, email.current, password.current);

    if (currentAuthForm === 'reset') {
      firebase
        .resetPassword(email.current)
        .then(() => {
          props.onDidDismiss();
        })
        .catch((error: any) => {
          errorsCheck(error);
        });
    } else {
      const credential = fb.auth.EmailAuthProvider.credential(email.current, password.current);

      console.log('credential', credential);

      // first we should try to login, even if the user is registering
      const auth = fb.auth();
      auth
        .signInWithCredential(credential)
        .then(result => {
          if (result.user) {
            console.log('User is logged in', result.user);

            // keeping the data of the anonymous user
            const from = user?.isAnonymous ? user.uid : null;

            // logging in as the requested user
            firebase.reloadAuth(result).then(() => {
              // if old user was anonymous — move the data to the real user
              // moveAnonymousData(from, to, result.user?.email || '');

              // set anonymous ID if exists
              if (from) {
                firebase.updateProfile({ anonymousId: from });
              }

              // close the popup
              props.onDidDismiss();
            });
          }
        })
        .catch((error: any) => {
          console.log('Error', error);
          if (error.code === 'auth/user-not-found') {
            // if there is no such user — register a new one
            fb.auth()
              .createUserWithEmailAndPassword(email.current, password.current)
              .then(result => {
                if (result.user) {
                  console.log('User is registered', result.user);

                  // keeping the data of the anonymous user
                  const from = user?.isAnonymous ? user.uid : null;

                  // logging in as the newly created user
                  firebase.reloadAuth(result).then(() => {
                    // if old user was anonymous — move the data to the real user
                    // moveAnonymousData(from, to, result.user?.email || '');

                    // set the email as the only property for the user
                    firebase.updateProfile({
                      email: result.user?.email,
                      anonymousId: from,
                    });

                    // close the popup
                    props.onDidDismiss();
                  });
                }
              })
              .catch(error => {
                errorsCheck(error);
              });
          } else {
            errorsCheck(error);
          }
        });
    }
  };

  // errors
  const [appError, setAppError] = useState('');

  const errorsCheck = (error: any) => {
    if (error && error.code) {
      console.log(error.code);
      switch (error.code) {
        case 'auth/network-request-failed': {
          setAppError(
            intl.formatMessage({
              id: 'auth.errors.network',
              defaultMessage: 'Problems with the network connection. Try again later.',
              description: 'Auth error: the network request failed',
            }),
          );
          break;
        }
        case 'auth/too-many-requests': {
          setAppError(
            intl.formatMessage({
              id: 'auth.errors.manyrequests',
              defaultMessage: 'Too many requests from your computer. Try again in an hour or more.',
              description: 'Auth error: too many requests',
            }),
          );
          break;
        }
        case 'auth/email-already-in-use': {
          setAppError(
            intl.formatMessage({
              id: 'auth.errors.emailinuse',
              defaultMessage: 'The email address is already registered. You should sign in.',
              description: 'Auth error: email is already in use',
            }),
          );
          break;
        }
        case 'auth/user-not-found': {
          setAppError(
            intl.formatMessage({
              id: 'auth.errors.emailnotfound',
              defaultMessage: 'The user with this email is not found.',
              description: 'Auth error: email not registered yet',
            }),
          );
          break;
        }
        case 'auth/invalid-email': {
          setAppError(
            intl.formatMessage({
              id: 'auth.errors.invalidemail',
              defaultMessage: 'The email address is badly formatted.',
              description: 'Auth error: invalid email format',
            }),
          );
          break;
        }
        case 'auth/wrong-password': {
          setAppError(
            intl.formatMessage({
              id: 'auth.errors.invalidpassword',
              defaultMessage: 'Wrong password. Correct and try again.',
              description: 'Auth error: invalid password',
            }),
          );
          break;
        }
        case 'auth/weak-password': {
          setAppError(
            intl.formatMessage({
              id: 'auth.errors.weakpassword',
              defaultMessage: 'The password must be 6 characters long or more.',
              description: 'Auth error: weak password, must be 6 chars or more',
            }),
          );
          break;
        }
        default: {
          setAppError(error.message);
        }
      }
    } else {
      console.error('Unexpected error', error);
    }
  };

  const clearErrors = (
    opts: { app?: boolean; email?: boolean; password?: boolean } = {
      app: true,
      email: true,
      password: true,
    },
  ) => {
    if (opts.app) {
      setAppError('');
    }
    if (opts.email) {
      setAppError('');
    }
    if (opts.password) {
      setAppError('');
    }
  };

  const updateEmail = (value: string) => {
    email.current = value;
    clearErrors({ app: true, email: true });
  };

  const updatePassword = (value: string) => {
    password.current = value;
    clearErrors({ app: true, password: true });
  };

  return (
    <IonModal
      ref={routerRef || null}
      isOpen={props.isOpen}
      onDidDismiss={() => props.onDidDismiss()}
      swipeToClose={true}
      presentingElement={routerRef}
    >
      <IonToolbar mode="md">
        <IonButtons slot="start">
          <IonButton onClick={() => props.onDidDismiss()}>
            <IonIcon slot="icon-only" icon={closeOutline} />
          </IonButton>
        </IonButtons>
        <IonTitle>
          <FormattedMessage id="modal.auth.title" defaultMessage="Sign In" />
        </IonTitle>
        {/* <IonToolbar className="segment-toolbar">
          <IonSegment
            value={currentAuthForm}
            onIonChange={evt => {
              clearErrors();
              setCurrentAuthForm(evt.detail.value);
            }}
            mode="ios"
          >
            <IonSegmentButton value="register">
              <IonLabel>
                <FormattedMessage id="modal.auth.type.register" defaultMessage="Register" />
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="login">
              <IonLabel>
                <FormattedMessage id="modal.auth.type.login" defaultMessage="Sign In" />
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="reset">
              <IonLabel>
                <FormattedMessage id="modal.auth.type.reset" defaultMessage="Reset Password" />
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar> */}
      </IonToolbar>
      <IonContent fullscreen>
        <form onSubmit={processForm}>
          <IonList style={{ margin: '1rem 2rem' }}>
            <TextField
              name="email"
              value={email.current}
              type="email"
              onChange={value => updateEmail(value.target?.value || '')}
              label={intl.formatMessage({ id: 'fields.email.label' })}
              // error={emailError}
            />
            {currentAuthForm !== 'reset' && (
              <TextField
                name="password"
                value={password.current}
                type="password"
                onChange={value => updatePassword(value.target?.value || '')}
                label={intl.formatMessage({ id: 'fields.password.label' })}
                placeholder={
                  currentAuthForm === 'register' ? intl.formatMessage({ id: 'fields.password.description' }) : ''
                }
              />
            )}
            {appError !== '' && (
              <div className="ion-padding">
                <IonLabel color="danger" position="stacked" className="error-label">
                  {appError}
                </IonLabel>
              </div>
            )}
            <IonButton
              size="default"
              expand="block"
              mode="ios"
              color="secondary"
              style={{
                margin: '1.6rem calc(var(--padding-start) + var(--ion-safe-area-left, 0px))',
              }}
              onClick={authAction}
            >
              <FormattedMessage id={`buttons.${currentAuthForm}`} />
            </IonButton>
          </IonList>
        </form>
      </IonContent>
    </IonModal>
  );
};

export default LoginPopup;
