import IUserService from "./IUserService";
import { IUser } from "../models/IUser";

class UserService implements IUserService {

    private _serviceUrl: string;

    public constructor(serviceUrl) {
        this._serviceUrl = serviceUrl;
    }

    public getUserStatus(userName: string): IUser {
        throw new Error("Method not implemented.");
    }
}

export default UserService;