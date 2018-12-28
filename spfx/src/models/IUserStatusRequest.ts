interface IUserStatusRequest {
    
    /**
     * The current user access token needed to call subsequent APIs
     */
    userAccessToken: string;
    
    /**
     * The user User Principal Name to search for
     */
    upn: string;
}

export default IUserStatusRequest;