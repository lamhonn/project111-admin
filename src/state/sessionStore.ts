import { atom } from "jotai";
import { atomFamily } from 'jotai-family'

import { SessionService } from "../api/services/sessionService";
import { Session } from "../types/models";
import { BillService } from "../api/services/billService";
import { Bill } from "../types/models/bill";
import { BillStatus } from "../types/enums/billStatus";
import { BillDto } from "../types/dtos/billDto";
import { OrderProductDto } from "../types/dtos/orderProductDto";
import { OrderDto } from "../types/dtos/orderDto";
import { OrderProductExcludableDto } from "../types/dtos/orderProductExcludableDto";
import { OrderProductToppingDto } from "../types/dtos/orderProductToppingDto";
import { OrderStatus } from "../types/enums/orderStatus";
import { OrderService } from "../api/services/orderService";
import { productsAtom } from "./productStore";
import { userIdAtom } from "./authStore";

// TODO: investigate atomFamily for independent resources (e.g. tabletSessions), so that we don't have to fetch every single session again

export const loadingAtom = atom(false); 

export const errorAtom = atom<string | null>(null);

export const sessionsAtom = atom<Session[]>([]);

export const getAllSessionsAtom = atom(
    (get) => get(sessionsAtom),
    async (get, set) => {
        set(loadingAtom, true);
        set(errorAtom, null);
        
        try {
            const userId = get(userIdAtom);
            if (!userId) return;

            const sessions = await SessionService.getByUserId(userId);
            set(sessionsAtom, sessions);
        }
        catch {
            set(errorAtom, "Error fetching sessions");
        }
        finally {
            set(loadingAtom, false);
        }
    }
);

export const currentSessionsAtom = atom<Session[]>([]);

export const getLatestSessionsAtom = atom(
    (get) => get(currentSessionsAtom),
    async (get, set) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const userId = get(userIdAtom);
            if (!userId) return;

            const sessions = await SessionService.getByUserId(userId, { GetLatest: true });
            set(currentSessionsAtom, sessions);
        }
        catch {
            set(errorAtom, "Error fetching sessions");
        }
        finally {
            set(loadingAtom, false);
        }
    }
);

export const getTabletSessionAtom = atomFamily((tabletId: string) =>
  atom((get) => {
    const sessions = get(currentSessionsAtom);

    return sessions.find(session => session.tabletId === tabletId)
  })
);

export const setEndSessionAtom = atom(
    null,
    async (get, set, id: string) => {
        try {
            const sessions = get(currentSessionsAtom);
            const currentSession = sessions.find(session => session.id === id);
    
            if (currentSession) {
                await SessionService.endSession(currentSession);
                set(currentSessionsAtom, get(currentSessionsAtom).filter(session => session.id !== id));
            }
        }
        catch (error) {
            console.error("Error setting end session:", error);
        }
    }
);

export const billsAtom = atom<Bill[]>([]);

// Not to be confused with getSessionBillsAtom
export const getBillsBySessionIdAtom = atom(
    (get) => get(billsAtom),
    async (get, set, sessionId: string) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const bills = await BillService.getNewBySessionId(sessionId);

            const currentBills = get(billsAtom);

            const updatedBills: Bill[] = bills.map(bill => {
                if (currentBills.find(prev => bill.id === prev.id)) { 
                    const currentBill = currentBills.find(prev => prev.id === bill.id);
                    return { 
                        ...currentBill,
                        ...bill
                    }
                }
                else {
                    return bill;
                }
            });

            set(billsAtom, updatedBills);
        }
        catch {
            set(errorAtom, "Error fetching bills");
        }
        finally {
            set(loadingAtom, false)
        }
    }
);

export const getSessionBillsAtom = atomFamily((sessionId: string) => 
    atom((get) => {
        return get(billsAtom).filter(bill => bill.sessionId === sessionId);
    })
);

export const updateSessionOrderStatusAtom = atom(
    null,
    async (get, set, payload: { sessionId: string; orderId: string; orderStatus: OrderStatus }) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const sessions = get(currentSessionsAtom);
            const session = sessions.find(current => current.id === payload.sessionId);
            const order = session?.orders.find(current => current.id === payload.orderId);

            if (!session || !order) {
                return;
            }

            const orderDto: OrderDto = {
                id: order.id,
                organizationId: order.organizationId,
                sessionId: order.sessionId,
                userId: order.userId,
                tabletId: order.tabletId,
                totalPrice: order.totalPrice,
                orderStatus: payload.orderStatus,
                orderProducts: order.orderProducts.map(orderProduct => <OrderProductDto>{
                    id: orderProduct.id,
                    productId: orderProduct.productId,
                    name: orderProduct.productName,
                    price: orderProduct.productPrice,
                    orderProductToppings: orderProduct.orderProductToppings.map(topping => <OrderProductToppingDto>{
                        id: topping.id,
                        orderProductId: orderProduct.id,
                        productToppingId: topping.productToppingId,
                    }),
                    orderProductExcludables: orderProduct.orderProductExcludables.map(excludable => <OrderProductExcludableDto>{
                        id: excludable.id,
                        orderProductId: orderProduct.id,
                        productExcludableId: excludable.productExcludableId,
                    }),
                }),
            };

            await OrderService.updateStatus(orderDto);

            set(currentSessionsAtom, sessions.map(currentSession =>
                currentSession.id === payload.sessionId
                    ? {
                        ...currentSession,
                        orders: currentSession.orders.map(currentOrder =>
                            currentOrder.id === payload.orderId
                                ? { ...currentOrder, orderStatus: payload.orderStatus }
                                : currentOrder
                        )
                    }
                    : currentSession
            ));
        }
        catch {
            set(errorAtom, "Error updating order status");
        }
        finally {
            set(loadingAtom, false);
        }
    }
);

export const confirmBillAtom = atom(
    null,
    async (get, set, billId: string) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const currentBills = get(billsAtom);
            const selectedBill = currentBills.find(prev => prev.id === billId);

            if (!selectedBill) return;

            const products = get(productsAtom);

            const updatedBill: BillDto = { 
                ...selectedBill, 
                status: BillStatus.COMPLETED,
                orderProducts: selectedBill.orderProducts.map(orderProduct => {
                    const product = products.find(product => product.id === orderProduct.productId);

                    return <OrderProductDto>{ 
                        ...orderProduct,
                        name: product?.name ?? '',
                        price: product?.price ?? 0
                    }
                })
            };

            const updatedBills: Bill[] = currentBills.map(bill => 
                bill.id === billId ? { ...bill, status: BillStatus.COMPLETED } : bill
            );

            set(billsAtom, updatedBills);

            await BillService.updateBillStatus(updatedBill);
        }
        catch {
            set(errorAtom, "Error updating bill status");
        }
        finally {
            set(loadingAtom, false);
        }
    }
);