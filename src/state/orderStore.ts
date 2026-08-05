import { atom } from 'jotai';
import { OrderDto } from '../types/dtos/orderDto';
import { OrderService } from '../api/services/orderService';
import { OrderViewModel } from '../types/viewModels/orderViewModel';
import { OrderStatus } from '../types/enums/orderStatus';
import { userIdAtom } from './authStore';
import { OrderProductDto } from '../types/dtos/orderProductDto';
import { OrderProductExcludableDto } from '../types/dtos/orderProductExcludableDto';
import { OrderProductToppingDto } from '../types/dtos/orderProductToppingDto';

// TODO: figure how do we update orders real-time using websockets

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

export const ordersAtom = atom<OrderViewModel[]>([]);

export const newOrdersAtom = atom(
    (get) => {
        const orders = get(ordersAtom);
        return orders.filter(order => order.OrderStatus === OrderStatus.RECEIVED);
    }
);

export const preparingOrdersAtom = atom(
    (get) => {
        const orders = get(ordersAtom);
        return orders.filter(order => order.OrderStatus === OrderStatus.PREPARING);
    }
);

export const getOrdersAtom = atom(
    (get) => get(ordersAtom),
    async (get, set) => {
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

export const updateOrderStatusAtom = atom(
    null,
    async (get, set, id: string, orderStatus: OrderStatus ) => {
        try {
            const selectedOrder = get(selectedOrderAtom);

            if (!selectedOrder) return;

            const orderProducts: OrderProductDto[] = selectedOrder.OrderProducts.map(viewModel => <OrderProductDto>{
                Id: viewModel.Id,
                ProductId: viewModel.ProductId,
                Name: viewModel.Name,
                OrderProductToppings: viewModel.ProductToppings.map(topping => <OrderProductToppingDto>{
                    Id: topping.Id,
                    OrderProductId: viewModel.Id,
                    ProductToppingId: topping.Id
                }),
                OrderProductExcludables: viewModel.ProductExcludables.map(excludable => <OrderProductExcludableDto>{
                    Id: excludable.Id,
                    OrderProductId: viewModel.Id,
                    ProductExcludableId: excludable.Id
                }),
                Price: viewModel.Price,
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