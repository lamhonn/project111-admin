import type { OrderActivityPayload } from '../websocket/client';
import { createIncomingDemoOrder } from './adapter';
import { demoUserId } from './data';

const delays = [6000, 10000];
const listeners = new Set<(payload: OrderActivityPayload) => void>();
let nextOrder = 0;
let timer: ReturnType<typeof setTimeout> | undefined;

function scheduleNextOrder() {
    if (timer !== undefined || listeners.size === 0 || nextOrder >= delays.length) return;

    timer = setTimeout(() => {
        timer = undefined;
        const order = createIncomingDemoOrder(nextOrder++);
        if (order) {
            const payload: OrderActivityPayload = {
                userId: order.userId,
                orderId: order.id,
                tabletId: order.tabletId,
                created: order.created,
            };
            listeners.forEach(listener => listener(payload));
        }
        scheduleNextOrder();
    }, delays[nextOrder]);
}

export function subscribeToDemoOrders(userId: string, onOrderCreated: (payload: OrderActivityPayload) => void): () => void {
    if (userId !== demoUserId) return () => {};

    const listener = (payload: OrderActivityPayload) => onOrderCreated(payload);
    listeners.add(listener);
    scheduleNextOrder();

    return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && timer !== undefined) {
            clearTimeout(timer);
            timer = undefined;
        }
    };
}

if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        if (timer !== undefined) clearTimeout(timer);
        listeners.clear();
    });
}