import axios from "../api/axios";
import { IChangePassword, ILogin, IRegister, IUpdateProfile } from "../types/auth.type";

export function loginService (loginData: ILogin) {
    return axios.post('/user/login', loginData)
}

export function registerService (registerData: IRegister) {
    return axios.post('/user/register', registerData)
}

export function myProfileService () {
    return axios.get('/user/profile').then(res => res.data);
}

export function changePasswordService (data: IChangePassword) {
    return axios.patch('/user/change-password', data).then(res => res.data);
}

export function updateProfileService (data: IUpdateProfile) {
    return axios.patch('/user', data).then(res => res.data);
}