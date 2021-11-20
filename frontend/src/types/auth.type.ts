import { IUser } from "./user.type";

export interface ILogin {
    email: string;
    password: string;
}

export interface IRegister {
    name: string;
    email: string;
    password: string;
}

export interface IAuthState {
    user?: IUser;
}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
}

export interface IUpdateProfile {
    bio?: string;
    email?: string;
    name?: string;
}