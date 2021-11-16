import axios from "axios";
import { API_URL, TOKEN_CONSTANT } from "../constants";

let authToken = localStorage.getItem(TOKEN_CONSTANT) ?? "";

console.log(TOKEN_CONSTANT);
console.log(authToken)

export default axios.create({
    baseURL: API_URL,
    headers: { 'x-jwt': authToken }
})
