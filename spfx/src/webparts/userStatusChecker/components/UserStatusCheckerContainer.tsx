import * as React from 'react';
import styles from './UserStatusCheckerContainer.module.scss';
import IUserStatusCheckerContainerProps from './IUserStatusCheckerContainerProps';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/TextField';
import IUserStatusCheckerContainerState from './IUserStatusCheckerContainerState';
import { Log } from '@microsoft/sp-core-library';
import { Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { IUserStatus } from '../../../models/IUser';

export default class UserStatusCheckerContainer extends React.Component<IUserStatusCheckerContainerProps, IUserStatusCheckerContainerState> {

  public constructor() {
    
    super();

    this.state = {
      user:null,
      userEmail: null
    } as IUserStatusCheckerContainerState;

    this._checkUserStatus = this._checkUserStatus.bind(this);

  }
  
  public render(): React.ReactElement<IUserStatusCheckerContainerProps> {

    let renderUserInfos: JSX.Element = null; 

    if (this.state.user) {

      let presence = PersonaPresence.online;

      switch (this.state.user.Status) {
        case IUserStatus.DoesNotExist:  presence = PersonaPresence.none;
                                        break;
  
        case IUserStatus.InternalUser:  presence = PersonaPresence.dnd
                                        break;    
  
        case IUserStatus.InvitationAccepted:  presence = PersonaPresence.online;
                                              break;
  
        case IUserStatus.InvitationPending:  presence = PersonaPresence.offline;
                                              break;    
      }


      renderUserInfos = 
      <Persona
        primaryText={`${this.state.user.FirstName} ${this.state.user.LastName}`}
        imageInitials={`${this.state.user.FirstName ? this.state.user.FirstName.charAt(0) : ''} ${this.state.user.LastName ? this.state.user.LastName.charAt(0) : ''}`}
        secondaryText={ this.state.user.Email}
        tertiaryText={ this.state.user.Status.toString() }
        size={PersonaSize.extraLarge}
        presence={presence}

      />;
    }

    return (
      <div className={ styles.userStatusChecker }>
        <TextField placeholder={"example@domain.com"} onChanged={ (value) => {
                this.setState({
                  userEmail: value,
                });
              }}/>
        <DefaultButton
            data-automation-id="check"
            disabled={!this.state.userEmail}
            text="Button"
            onClick={() => { this._checkUserStatus(this.state.userEmail)}}
          />
          {renderUserInfos}
      </div>
    );
  }

  /**
   * Chec kthe user status in AD
   * @param userEmail the user email from the text box
   */
  public async _checkUserStatus(userEmail: string) {

    try {

      const user = await this.props.userService.getUserStatus(userEmail);

      this.setState({
        user: user
      } as IUserStatusCheckerContainerState);

    } catch (error) {
      Log.error("UserStatusCheckerContainer", new Error(JSON.stringify(error)));
    }
  }
}
