import { OrderDto } from "../../types/dtos/orderDto";
import { Order } from "../../types/models";
import { api } from "../axios";

const baseUrl = "/orders";

export const OrderService = {
    getById: async (id: string) => {
        const { data } = await api.get<Order>(`${baseUrl}/${id}`);
        return data;
    },

    getByUserId: async (id: string) => {
        const { data } = await api.get<Order[]>(`${baseUrl}/user/${id}`);
        return data;
    },

    getByOrganizationId: async (organizationId: string) => {
        const { data } = await api.get<Order[]>(`${baseUrl}/organization/${organizationId}`);
        return data;
    },

    updateStatus: async (orderDto: OrderDto) => {
        const { data } = await api.patch<OrderDto>(baseUrl, orderDto);
        return data;
    }
}