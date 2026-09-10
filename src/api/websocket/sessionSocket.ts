import { SessionActivityPayload, ws } from "./client";

export const SessionWebSocket = {
    subscribeToSessionCreated: (
        userId: string, 
        onSessionCreated: (payload: SessionActivityPayload) => void
    ) => {
        return ws.subscribeUser(userId, { onSessionCreated });
    },

    subscribeToSessionEnded: (
        userId: string,
        onSessionEnded: (payload: SessionActivityPayload) => void
    ) => {
        return ws.subscribeUser(userId, { onSessionEnded });
    }
};