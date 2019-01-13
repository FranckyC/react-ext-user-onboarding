declare interface IUserStatusCheckerWebPartStrings {
  PropertyPane: {
    ServiceSettings: string;
    UrlErrorMessage: string;
    MsFlowUrl: string;
  },
  EmailErrorMessage: string;
  CheckStatusBtnLabel: string;
  UserStatus: {
    UnknowStatus: string;
    InternalUser: string;
    DoesNotExist: string;
    InvitationPendingAcceptance: string;
    InvitationAccepted: string;
  },
  ConnectionName: string;
}

declare module 'UserStatusCheckerWebPartStrings' {
  const strings: IUserStatusCheckerWebPartStrings;
  export = strings;
}
