import { api } from "../axios";

const baseUrl = "/pairing";

export const PairingService = {
    startPairing: async () => {
        const { data } = await api.post(`${baseUrl}/start`);
        return data;
    },
    
    stopPairing: async (id: string) => {
        const { data } = await api.post(`${baseUrl}/stop/${id}`);
        return data;
    }
}