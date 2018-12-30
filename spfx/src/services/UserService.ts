import IUserService from "./IUserService";
import { IUser } from "../models/IUser";
import { HttpClient } from "@microsoft/sp-http";
import { ConsoleListener, LogLevel, Logger } from '@pnp/logging';
import { SPFxAdalClient } from "@pnp/common";
import IUserStatusRequest from "../models/IUserStatusRequest";

class UserService implements IUserService {

    private readonly GRAPH_ENDPOINT = "https://graph.microsoft.com";

    private _httpClient: HttpClient;
    private _spfxAdalClient: SPFxAdalClient;
    private _serviceUrl: string;

    public get serviceUrl(): string { return this._serviceUrl; }
    public set serviceUrl(value: string) { this._serviceUrl = value; }

    public constructor(httpClient: HttpClient, adalClient: SPFxAdalClient) {

        this._httpClient = httpClient;
        this._spfxAdalClient = adalClient;

        const consoleListener = new ConsoleListener();
        Logger.subscribe(consoleListener);
    }

    public async getUserStatus(userName: string): Promise<IUser> {

        // Make the call to the Flow
        const url = this._serviceUrl;

        try {

            // Get the current user access token
            const token = await this._spfxAdalClient.getToken(this.GRAPH_ENDPOINT);

            const postData: string = JSON.stringify({
                userAccessToken: token,
                upn: userName
            } as IUserStatusRequest);

            const requestHeaders = new Headers();
            requestHeaders.append('Accept','application/json;');
            requestHeaders.append('Content-Type','application/json; charset=utf-8');
            requestHeaders.append('Cache-Control','no-cache');

            const results = await this._httpClient.post(url, HttpClient.configurations.v1, {
                headers: requestHeaders,
                body: postData
            });

            const response: IUser = await results.json();        

            if (results.status === 200) {
                return response;
            } else {
                const error = JSON.stringify(response);
                Logger.write(`[UserService.getUserStatus()]: Error: '${error}' for url '${url}'`, LogLevel.Error);
                throw new Error(error);
            }
        } catch (error) {
            const errorMessage = error ? error.message : `Failed to fetch URL '${url}'`;
            Logger.write(`[UserService.getUserStatus()]: Error: '${errorMessage}' for url '${url}'`, LogLevel.Error);
            throw new Error(errorMessage);
        }
    }
}

export default UserService;