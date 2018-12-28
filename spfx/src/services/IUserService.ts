import { IUser } from "../models/IUser";

interface IUserService {

    /**
     * Gets the status of this user
     * @param userEmail the user email to look for
     */
    getUserStatus(userEmail: string): IUser;
}

export default IUserService;