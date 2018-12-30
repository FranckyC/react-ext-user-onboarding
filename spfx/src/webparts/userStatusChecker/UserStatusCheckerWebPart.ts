import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'UserStatusCheckerWebPartStrings';
import UserStatusChecker from './components/UserStatusCheckerContainer';
import IUserStatusCheckerWebPartProps from './IUserStatusCheckerWebPartProps';
import IUserService from '../../services/IUserService';
import UserService from '../../services/UserService';
import MockUserService from '../../services/MockUserService';
import IUserStatusCheckerContainerProps from './components/IUserStatusCheckerContainerProps';
import { AdalClient } from '@pnp/common';

export default class UserStatusCheckerWebPart extends BaseClientSideWebPart<IUserStatusCheckerWebPartProps> {

  private _userService: IUserService;
  
  public render(): void {
    const element: React.ReactElement<IUserStatusCheckerContainerProps > = React.createElement(
      UserStatusChecker,
      {
        userService: this._userService
      } as IUserStatusCheckerContainerProps
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {

    if (Environment.type === EnvironmentType.Local) {
      this._userService = new MockUserService();
    } else {

      const spfxAdalClient = AdalClient.fromSPFxContext(this.context);
      this._userService = new UserService(this.context.httpClient, spfxAdalClient);
      this._userService.serviceUrl = this.properties.flowUrl;
    }

    return super.onInit();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: strings.PropertyPane.ServiceSettings,
              groupFields: [
                PropertyPaneTextField('flowUrl', {
                  label: strings.PropertyPane.MsFlowUrl,
                  value: this.properties.flowUrl,
                  onGetErrorMessage: this._validateServiceUrl
                })
              ]
            }
          ]
        }
      ]
    };
  }

  protected onPropertyPaneFieldChanged(propertyPath: string) {
    if (propertyPath === 'flowUrl') {
      this._userService.serviceUrl = this.properties.flowUrl;
    }
  }

  /**
   * Ensures the service URL is valid 
   * @param value the service URL
   */
  private _validateServiceUrl(value: string) {

    if ((!/^(https?):\/\/[^\s/$.?#].[^\s]*/.test(value) || !value)) {
      return strings.PropertyPane.UrlErrorMessage;
    } else {
        return '';
    }
  }
}
