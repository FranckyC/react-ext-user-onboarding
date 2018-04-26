import * as React from 'react';
import styles from './ExternalUserOnboarding.module.scss';
import { IExternalUserOnboardingProps } from './IExternalUserOnboardingProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { AadHttpClient, HttpClientResponse, IHttpClientOptions } from '@microsoft/sp-http';

export default class ExternalUserOnboarding extends React.Component<IExternalUserOnboardingProps, {}> {
  public render(): React.ReactElement<IExternalUserOnboardingProps> {
    return (
      <div className={ styles.externalUserOnboarding }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  public async componentDidMount() {


    const headers: Headers = new Headers();
    headers.append("Content-Type","application/json");
    headers.append("Accept","application/json");
    headers.append("Access-Control-Allow-Credentials", "true");

    const request: IHttpClientOptions = {
      body: "",
      headers: headers
    }
    
    /*Create a new instance of AadHttpClient by passing in the current ServiceScope 
    and the ClientId (Application ID) of the Azure AD app registration*/
    const customApiClient: AadHttpClient = new AadHttpClient(this.props.context.serviceScope,"c505c38f-1224-4795-a643-c7eb9e0b1d27");
    const results = await customApiClient.post('https://extuseronboardw4lxu.azurewebsites.net/api/Get-ExternalUserStatus', AadHttpClient.configurations.v1, request);
    const json = await results.json();


    const debug = json;
  }
}
