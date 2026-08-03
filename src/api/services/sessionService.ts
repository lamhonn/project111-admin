import { api } from "../axios";
import { SessionDto } from "../../types/dtos";
import { Session } from "../../types/models";

const baseUrl = "/sessions";

export const SessionService = {
    getById: async (id: string) => {
        const { data } = await api.get<Session>(`${baseUrl}/${id}`);
        return data;
    },

    getByUserId: async (id: string) => {
        const { data } = await api.get<Session[]>(`${baseUrl}/user/${id}`);
        return data;
    },

    endSession: async (session: SessionDto) => {
        const { data } = await api.patch<SessionDto>(baseUrl, session);
        return data;        
    }
}