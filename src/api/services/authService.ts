import { LoginDto } from "../../types/dtos/loginDto";
import { api } from "../axios";

const baseUrl = "/auth";

export const AuthService = {
    login: async (login: LoginDto) => {
        const { data } = await api.post<string>(`${baseUrl}/login`, login);        
        return data;
    },

    refresh: async () => {
        const { data } = await api.post<string>(`${baseUrl}/refresh`);
        return data;
    },

    logout: async () => {
        const { data } = await api.post<string>(`${baseUrl}/logout`);
        return data;
    }
}