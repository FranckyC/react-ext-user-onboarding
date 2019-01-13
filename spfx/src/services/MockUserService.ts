import IUserService from "./IUserService";
import { IUser, IUserStatus } from "../models/IUser";

class MockUserService implements IUserService {

    private _serviceUrl: string;

    public get serviceUrl(): string { return this._serviceUrl; }
    public set serviceUrl(value: string) { this._serviceUrl = value; }

    private _mockUsers: IUser[];

    public constructor() {

        // Define here the mock users.
        this._mockUsers = [
            {
                Email: "dmorielli@free.fr",
                Status: IUserStatus.UnknowStatus
            },
            {
                Email: "denis.morielli@aequos.ca",
                FirstName: "Denis",
                LastName: "Morielli",
                Status: IUserStatus.InvitationAccepted,
                ConnectionName: "dmorielli@aequos.ca"
            },
            {
                Email: "franck.cornu@aequos.ca",
                FirstName: "Franck",
                LastName: "Cornu",
                Status: IUserStatus.InternalUser
            },
            {
                Email: "franck.cornu@outlook.com",
                Status: IUserStatus.DoesNotExist
            },
            {
                Email: "franck.cornu@gmail.com",
                FirstName: "Franck",
                LastName: "Cornu",
                Status: IUserStatus.InvitationPendingAcceptance,
                ConnectionName: "franck.cornu@aequos.ca"
            }
        ];
    }

    public getUserStatus(userEmail: string): Promise<IUser> {

        let user: IUser = {
            Email: userEmail,
            Status: IUserStatus.DoesNotExist
        };

        user = this._mockUsers.filter(e => { return e.Email === userEmail; })[0];

        return new Promise((resolve) => {
            setTimeout(resolve, 500, user);
        });
    }
}

export default MockUserService;
