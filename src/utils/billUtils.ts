import { Bill } from "../types/models/bill";

export function calculateTotalBillsPrice(bills: Bill[]): number {
    const totalPrice = bills.reduce((total, bill) => total + bill.totalPrice, 0);
    return totalPrice;
};