import { TabletActivityPayload, ws } from "./client";

export const TabletWebSocket = {
    subscribeToTabletCreated: (
        userId: string, 
        onTabletCreated: (payload: TabletActivityPayload) => void
    ) => {
        return ws.subscribeUser(userId, { onTabletCreated });
    }
};