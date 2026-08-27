import { api } from '../axios';
import { Organization } from "../../types/models";
import { OrganizationDto } from '../../types/dtos/organizationDto';

const baseUrl = "/organizations";

export const OrganizationService = {
    getById: async (id: string) => {
        const { data } = await api.get<Organization>(`${baseUrl}/${id}`);
        return data;
    },

    update: async (organizationDto: OrganizationDto) => {
        const { data } = await api.put<OrganizationDto>(baseUrl, organizationDto);
        return data;
    },
}