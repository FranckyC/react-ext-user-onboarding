export interface IUser {
    Status: IUserStatus;
    FirstName?: string;
    LastName?: string;
    Email: string;
}

export enum IUserStatus {
    InternalUser = 1,
    DoesNotExist = 2,
    InvitationPending = 3,
    InvitationAccepted = 4
}