import axios from "axios";
import { API_URL, TOKEN_CONSTANT } from "../constants";

let authToken = localStorage.getItem(TOKEN_CONSTANT) ?? "";

export default axios.create({
    baseURL: API_URL,
    headers: { 'x-jwt': authToken }
})
