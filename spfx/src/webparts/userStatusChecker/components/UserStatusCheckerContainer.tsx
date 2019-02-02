import * as React from 'react';
import styles from './UserStatusCheckerContainer.module.scss';
import IUserStatusCheckerContainerProps from './IUserStatusCheckerContainerProps';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import IUserStatusCheckerContainerState from './IUserStatusCheckerContainerState';
import { Log } from '@microsoft/sp-core-library';
import { Persona, PersonaSize, PersonaPresence, IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { IUserStatus } from '../../../models/IUser';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import * as strings from 'UserStatusCheckerWebPartStrings';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export default class UserStatusCheckerContainer extends React.Component<IUserStatusCheckerContainerProps, IUserStatusCheckerContainerState> {

  public constructor(props: IUserStatusCheckerContainerProps) {

    super(props);

    this.state = {
      isProcessing: false,
      user: null,
      userEmail: null,
      errorMessage: ''
    } as IUserStatusCheckerContainerState;

    this._checkUserStatus = this._checkUserStatus.bind(this);
    this._validateEmail = this._validateEmail.bind(this);
  }

  public render(): React.ReactElement<IUserStatusCheckerContainerProps> {

    let renderUserInfos: JSX.Element = null;
    let isProcessing = this.state.isProcessing;
    let renderError: JSX.Element = null;
    let renderOverlay: JSX.Element = null;

    if (this.state.user) {

      let personaProps: IPersonaProps = {
        primaryText: this.state.user.Email,
        size: PersonaSize.large,
      };

      switch (this.state.user.Status) {
        case IUserStatus.UnknowStatus:
          personaProps.presence = PersonaPresence.none;
          personaProps.showUnknownPersonaCoin = true;
          personaProps.secondaryText = strings.UserStatus.UnknowStatus;
          break;

        case IUserStatus.DoesNotExist:
          personaProps.presence = PersonaPresence.none;
          personaProps.showUnknownPersonaCoin = true;
          personaProps.secondaryText = strings.UserStatus.DoesNotExist;
          break;

        case IUserStatus.InternalUser:
          personaProps.presence = PersonaPresence.online;
          personaProps.secondaryText = strings.UserStatus.InternalUser;
          personaProps.tertiaryText = strings.ConnectionName + this.state.user.ConnectionName;
          break;

        case IUserStatus.InvitationAccepted:
          personaProps.presence = PersonaPresence.online;
          personaProps.secondaryText = strings.UserStatus.InvitationAccepted;
          personaProps.tertiaryText = strings.ConnectionName + this.state.user.ConnectionName;
          break;

        case IUserStatus.InvitationPendingAcceptance:
          personaProps.presence = PersonaPresence.away;
          personaProps.secondaryText = strings.UserStatus.InvitationPendingAcceptance;
          personaProps.tertiaryText = strings.ConnectionName + this.state.user.ConnectionName;
          break;
      }

      renderUserInfos =
        <div className={styles.userInfos}>
          <Persona {...personaProps} />
        </div>;
    }


    if (this.state.errorMessage) {
      renderError = <div className={styles.errorMessage}><MessageBar messageBarType={MessageBarType.error} onDismiss={() => { this.setState({ errorMessage: '' }); }} dismissButtonAriaLabel="Close">{this.state.errorMessage}</MessageBar></div>;
    }

    if (isProcessing) {
      renderOverlay = <div>
        <Overlay isDarkThemed={false} className={styles.overlay}>
          <Spinner size={SpinnerSize.medium} />
        </Overlay>
      </div>;
    }

    return (
      <div className={styles.userStatusChecker}>
        {renderOverlay}
        {renderError}
        <div className={styles.searchBar}>
          <TextField placeholder={"example@domain.com"} onChanged={(value) => {
            this.setState({
              userEmail: value,
            });
          }}
            onKeyDown={(event) => {

              // Submit search on "Enter"
              if (event.keyCode === 13 && this._validateEmail(this.state.userEmail) === '') {
                this._checkUserStatus(this.state.userEmail);
              }
            }}
            onGetErrorMessage={this._validateEmail}
            deferredValidationTime={0}
            validateOnLoad={false}
          />
          <DefaultButton
            data-automation-id="check"
            disabled={!this.state.userEmail || isProcessing || this._validateEmail(this.state.userEmail) !== ''}
            text={strings.CheckStatusBtnLabel}
            onClick={() => { this._checkUserStatus(this.state.userEmail); }}
          />
        </div>
        {renderUserInfos}
      </div>
    );
  }

  /**
   * Check the user status in Actice Directory
   * @param userEmail the user email from the text box
   */
  public async _checkUserStatus(userEmail: string) {

    try {

      this.setState({
        isProcessing: true
      });

      let user = await this.props.userService.getUserStatus(userEmail);

      // Create a default user
      if (!user) {
        user = {
          Email: userEmail,
          Status: IUserStatus.DoesNotExist
        };
      }

      this.setState({
        isProcessing: false,
        user: user
      } as IUserStatusCheckerContainerState);

    } catch (error) {
      Log.error("UserStatusCheckerContainer", new Error(JSON.stringify(error)));

      this.setState({
        isProcessing: false,
        user: null,
        errorMessage: error.message
      } as IUserStatusCheckerContainerState);
    }
  }

  private _validateEmail(value: string) {

    if ((!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || !value)) {
      return strings.EmailErrorMessage;
    } else {
      return '';
    }
  }
}
