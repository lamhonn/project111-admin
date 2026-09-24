import { useTranslation } from "react-i18next";
import { OrderStatus } from "../types/enums/orderStatus";
import { OrderProductViewModel } from "../types/viewModels/orderProductViewModel";
import { OrderViewModel } from "../types/viewModels/orderViewModel";

export function calculateTotalOrderPrice(orderProducts: OrderProductViewModel[]): number {
    const totalPrice =  orderProducts.reduce(((total, product) => total + product.price), 0);
    return totalPrice;
};

export function calculateTotalSessionPrice(orders: OrderViewModel[]): number {
    const totalPrice = orders.reduce((total, order) => total + order.totalPrice, 0);
    return totalPrice;
};

export function calculateTotalOrderProductsPrice(orderProducts: OrderProductViewModel[]): number {
    return orderProducts.reduce((sum, orderProduct) => sum + orderProduct.price, 0);
};

export function getOrderStatusLabel(orderStatus: OrderStatus): string {
    const { t } = useTranslation();

    switch (orderStatus) {
      case OrderStatus.PENDING:
        return t('status.orderStatus.pending');
      case OrderStatus.RECEIVED:
        return t('status.orderStatus.received');
      case OrderStatus.PREPARING:
        return t('status.orderStatus.preparing');
      case OrderStatus.COMPLETED:
        return t('status.orderStatus.completed');
      default:
        return t('status.unknown');
    }
};

export function getOrderStatusColor(status: OrderStatus) {
  switch (status) {
    case OrderStatus.COMPLETED:
      return {
        backgroundColor: '#dcfce7',
        color: '#22c55e',
      };
    case OrderStatus.RECEIVED:
      return {
        backgroundColor: '#e5e7eb',
        color: '#92400e',
      };
    case OrderStatus.PENDING:
    case OrderStatus.PREPARING:
      return {
        backgroundColor: '#fef3c7',
        color: '#92400e',
      };
    default:
      return;
  }
};