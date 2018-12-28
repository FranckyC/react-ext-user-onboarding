import IUserService from "./IUserService";
import { IUser, IUserStatus } from "../models/IUser";

class MockUserService implements IUserService {

    private _mockUsers: IUser[];

    public constructor() {
        
        // Define here the mock users.
        this._mockUsers = [
            {
                Email: "denis.morielli@aequos.ca",
                FirstName: "Denis",
                LastName: "Morielli",
                Status: IUserStatus.InternalUser
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
                Status: IUserStatus.InvitationPending
            }
        ];
    }

    public getUserStatus(userEmail: string): IUser {
       return this._mockUsers.filter(e => { return e.Email === userEmail; })[0];
    }
}

export default MockUserService;