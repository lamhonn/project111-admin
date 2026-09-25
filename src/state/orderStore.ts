import { atom } from 'jotai';
import { OrderDto } from '../types/dtos/orderDto';
import { OrderService } from '../api/services/orderService';
import { OrderStatus } from '../types/enums/orderStatus';
import { userIdAtom } from './authStore';
import { OrderProductDto } from '../types/dtos/orderProductDto';
import { OrderProductExcludableDto } from '../types/dtos/orderProductExcludableDto';
import { OrderProductToppingDto } from '../types/dtos/orderProductToppingDto';
import { Order } from '../types/models';

export const errorAtom = atom<string | null>(null);

export const loadingAtom = atom<boolean>(false);

export const selectedOrderIdAtom = atom<string | null>(null);

export const selectedOrderAtom = atom(
    (get) => {
        const orderId = get(selectedOrderIdAtom);
        const orders = get(ordersAtom);
        return orders.find(order => order.id === orderId);
    }
);

// TODO: make into atomFamily; investigate atomFamily for independent resources, so that we don't have to fetch every single session again
export const ordersAtom = atom<Order[]>([]);

export const getNewOrdersAtom = atom(
    (get) => {
        const orders = get(ordersAtom);
        return orders.filter(order => order.orderStatus === OrderStatus.RECEIVED);
    },
    async (get, set) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const userId = get(userIdAtom);
            if (!userId) return;
    
            const response = await OrderService.getByUserId(userId);
            if (!response) return;

            const existingOrders = get(ordersAtom);
            const updatedOrders = [
                ...existingOrders.map(existingOrder => {
                    const newOrder = response.find(
                        order => order.id === existingOrder.id
                    );

                    return newOrder ?? existingOrder;
                }),
                ...response.filter(
                    newOrder =>
                        !existingOrders.some(
                            existingOrder => existingOrder.id === newOrder.id
                        )
                )
            ];

            set(ordersAtom, updatedOrders.sort((first, second) =>
                new Date(second.created).getTime() - new Date(first.created).getTime()
            ));
        }
        catch {
            set(errorAtom, "Error fetching orders");
            return null;
        }
        finally {
            set(loadingAtom, false);
        }
    }
);

export const preparingOrdersAtom = atom(
    (get) => {
        const orders = get(ordersAtom);
        return orders.filter(order => order.orderStatus === OrderStatus.PREPARING);
    }
);

// Get all orders by userId
export const getAllOrdersAtom = atom(
    (get) => get(ordersAtom),
    async (get, set) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const userId = get(userIdAtom);
            if (!userId) return;
    
            const response = await OrderService.getByUserId(userId);
            if (!response) return;
    
            return response;
        }
        catch {
            set(errorAtom, "Error fetching orders");
            return null;
        }
        finally {
            set(loadingAtom, false);
        }
    }
);

// TODO: Add a function to get orders by tablet id possibly to reduce payload size; we don't always need all of the tablets' order statuses
export const updateOrderStatusAtom = atom(
    null,
    async (get, set, id: string, orderStatus: OrderStatus ) => {
        try {
            const selectedOrder = get(selectedOrderAtom);

            if (!selectedOrder) return;

            const orderProducts: OrderProductDto[] = selectedOrder.orderProducts.map(order => <OrderProductDto>{
                id: order.id,
                productId: order.productId,
                name: order.productName,
                orderProductToppings: order.orderProductToppings.map(topping => <OrderProductToppingDto>{
                    id: topping.id,
                    orderProductId: order.id,
                    productToppingId: topping.id
                }),
                orderProductExcludables: order.orderProductExcludables.map(excludable => <OrderProductExcludableDto>{
                    id: excludable.id,
                    orderProductId: order.id,
                    productExcludableId: excludable.id
                }),
                price: order.productPrice,
            });

            const orderDto: OrderDto = {
                id: selectedOrder.id,
                userId: selectedOrder.userId,
                tabletId: selectedOrder.tabletId,
                totalPrice: selectedOrder.totalPrice,
                organizationId: selectedOrder.organizationId,
                sessionId: selectedOrder.sessionId,
                orderProducts: orderProducts,
                orderStatus: orderStatus,
            }

            const response = await OrderService.updateStatus(orderDto);
            set(ordersAtom, get(ordersAtom).map(order =>
                order.id === selectedOrder.id ? { ...order, orderStatus } : order
            ));
            return response;
        }
        catch {
            set(errorAtom, `Error updating order status for ${id}`);
            return null;
        }
        finally {
            set(loadingAtom, false);
        }
    }
);

export const orderOptionsDialogOpenAtom = atom<boolean>(false);