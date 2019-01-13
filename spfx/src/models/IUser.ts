export interface IUser {
    Status: IUserStatus;
    FirstName?: string;
    LastName?: string;
    Email: string;
    ConnectionName?: string;
}

export enum IUserStatus {
    UnknowStatus = "0",
    InternalUser = "1",
    DoesNotExist = "2",
    InvitationPendingAcceptance = "3",
    InvitationAccepted = "4"
}
