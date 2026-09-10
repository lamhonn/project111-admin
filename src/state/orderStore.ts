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
        return orders.find(order => order.Id === orderId);
    }
);

// TODO: make into atomFamily; investigate atomFamily for independent resources, so that we don't have to fetch every single session again
export const ordersAtom = atom<Order[]>([]);

export const getNewOrdersAtom = atom(
    (get) => {
        const orders = get(ordersAtom);
        return orders.filter(order => order.OrderStatus === OrderStatus.RECEIVED);
    },
    async (get, set) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const userId = get(userIdAtom);
            if (!userId) return;
    
            const response = await OrderService.getByUserId(userId, { Status: OrderStatus.RECEIVED });
            if (!response) return;

            const existingOrders = get(ordersAtom);
            const updatedOrders = [
                ...existingOrders.map(existingOrder => {
                    const newOrder = response.find(
                        order => order.Id === existingOrder.Id
                    );

                    return newOrder ?? existingOrder;
                }),
                ...response.filter(
                    newOrder =>
                        !existingOrders.some(
                            existingOrder => existingOrder.Id === newOrder.Id
                        )
                )
            ];

            set(ordersAtom, updatedOrders);
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
        return orders.filter(order => order.OrderStatus === OrderStatus.PREPARING);
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

            const orderProducts: OrderProductDto[] = selectedOrder.OrderProducts.map(order => <OrderProductDto>{
                Id: order.Id,
                ProductId: order.ProductId,
                Name: order.ProductName,
                OrderProductToppings: order.OrderProductToppings.map(topping => <OrderProductToppingDto>{
                    Id: topping.Id,
                    OrderProductId: order.Id,
                    ProductToppingId: topping.Id
                }),
                OrderProductExcludables: order.OrderProductExcludables.map(excludable => <OrderProductExcludableDto>{
                    Id: excludable.Id,
                    OrderProductId: order.Id,
                    ProductExcludableId: excludable.Id
                }),
                Price: order.ProductPrice,
            });

            const orderDto: OrderDto = {
                Id: selectedOrder.Id,
                UserId: selectedOrder.UserId,
                TabletId: selectedOrder.TabletId,
                TotalPrice: selectedOrder.TotalPrice,
                OrganizationId: selectedOrder.OrganizationId,
                SessionId: selectedOrder.SessionId,
                OrderProducts: orderProducts,
                OrderStatus: orderStatus,
            }

            const response = await OrderService.updateStatus(orderDto);
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