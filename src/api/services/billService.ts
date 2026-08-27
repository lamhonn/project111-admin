import { api } from "../axios";
import { Bill } from "../../types/models/bill";
import { BillDto } from "../../types/dtos/billDto";

const baseUrl = "/bills";

export const BillService = {
    getNewBySessionId: async (sessionId: string) => {
        const { data } = await api.get<Bill[]>(`${baseUrl}/${sessionId}`);
        return data;
    },

    updateBillStatus: async (billDto: BillDto) => {
        const { data } = await api.patch<BillDto>(baseUrl, billDto);
        return data;
    }
}