import { IUser } from "../../../models/IUser";

interface IUserStatusCheckerContainerState {
    isProcessing: boolean;
    user?: IUser;
    userEmail: string;
    errorMessage: string;
}

export default IUserStatusCheckerContainerState;