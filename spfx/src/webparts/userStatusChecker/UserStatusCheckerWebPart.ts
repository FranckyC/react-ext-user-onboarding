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
      this._userService = new UserService(this.properties.flowUrl);
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
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('flowUrl', {
                  label: "Flow URL",
                  value: this.properties.flowUrl
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
