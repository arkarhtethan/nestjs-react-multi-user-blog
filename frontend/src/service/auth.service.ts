import axios from "../api/axios";
import { ILogin, IRegister } from "../types/auth.type";

export function loginService (loginData: ILogin) {
    return axios.post('/user/login', loginData)
}

export function registerService (registerData: IRegister) {
    return axios.post('/user/register', registerData)
}

export function myProfileService () {
    return axios.get('/user/profile').then(res => res.data);
}