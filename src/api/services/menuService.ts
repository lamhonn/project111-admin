import { api } from "../axios";
import { Menu } from "../../types/models";
import { MenuDto } from "../../types/dtos/menuDto";

const baseUrl = "/menus";

export const MenuService = {
    create: async (menuDto: MenuDto) => {
        const { data } = await api.post<MenuDto>(baseUrl, menuDto);
        return data;
    },

    getByOrganizationId: async (organizationId: string) => {
        const { data } = await api.get<Menu[]>(`${baseUrl}/organization/${organizationId}`);
        return data;
    },

    update: async (menuDto: MenuDto) => {
        const { data } = await api.put<MenuDto>(baseUrl, menuDto);
        return data;
    },

    delete: async (id: string) => {
        const { data } = await api.delete(`${baseUrl}/${id}`);
        return data;
    },
}