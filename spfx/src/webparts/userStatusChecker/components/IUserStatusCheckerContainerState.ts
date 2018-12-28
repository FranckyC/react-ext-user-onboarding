import { IUser } from "../../../models/IUser";

interface IUserStatusCheckerContainerState {
    user?: IUser;
    userEmail: string;
}

export default IUserStatusCheckerContainerState;