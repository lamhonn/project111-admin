import axios from "axios";
import { registerInterceptors } from "./interceptors";

// TODO: placeholder. create proper .env
const ENV = {
    apiBaseUrl: "https://localhost:7123",
};

export const api = axios.create({
    baseURL: ENV.apiBaseUrl,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

registerInterceptors(api);