import { IUser } from "../models/IUser";

interface IUserService {

    /**
     * The URL of the user service
     */
    serviceUrl: string;

    /**
     * Gets the status of this user
     * @param userEmail the user email to look for
     */
    getUserStatus(userEmail: string): Promise<IUser>;
}

export default IUserService;