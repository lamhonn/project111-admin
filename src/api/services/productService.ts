import { api } from "../axios";
import { Product } from "../../types/models";
import { ProductDto } from "../../types/dtos/productDto";

const baseUrl = "/products";

export const ProductService = {
    create: async (productDto: ProductDto) => {
        const { data } = await api.post<ProductDto>(baseUrl, productDto);
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get<Product>(`${baseUrl}/${id}`);
        return data;
    },

    getByOrganization: async (organizationId: string) => {
        const { data } = await api.get<Product[]>(`${baseUrl}/organization/${organizationId}`);
        return data;
    },

    update: async (productDto: ProductDto) => {
        const { data } = await api.put<ProductDto>(baseUrl, productDto);
        return data;
    },

    delete: async (id: string) => {
        const { data } = await api.delete<Product>(`${baseUrl}/${id}`);
        return data;
    }
}