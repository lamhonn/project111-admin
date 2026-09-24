import { Order } from "./order";
import { User } from "./user";

export interface Session {
    id: string,
    organizationId: string,
    userId: string,
    user: User | null,
    tabletId: string,
    startTime: Date,
    endTime: Date | null,
    orders: Order[],
}