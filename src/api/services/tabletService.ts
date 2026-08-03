import { api } from "../axios";
import { TabletDto } from "../../types/dtos/tabletDto";
import { Tablet } from "../../types/models";

const baseUrl = "/tablets";

export const TabletService = {
    create: async (tabletDto: TabletDto) => {
        const { data } = await api.post<TabletDto>(baseUrl, tabletDto);
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get<Tablet>(`${baseUrl}/${id}`);
        return data;
    },

    getByUserId: async (id: string) => {
        const { data } = await api.get<Tablet[]>(`${baseUrl}/user/${id}`);
        return data;
    },

    update: async (tabletDto: TabletDto, id: string) => {
        const { data } = await api.put<TabletDto>(`${baseUrl}/${id}`, tabletDto);
        return data;
    },

    delete: async (id: string) => {
        const { data } = await api.delete(`${baseUrl}/${id}`);
        return data;
    }
}