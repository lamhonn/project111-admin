import type { Order, OrderProduct } from '../types';

const now = new Date('2026-02-24T10:00:00.000Z');

export const MOCK_HISTORY_ORDERS_API: Order[] = [
  { Id: 'ORD-2026-001', OrganizationId: 'org-1', TotalPrice: '45.50', TableId: 'T001', Created: new Date('2026-02-10T14:23:00.000Z') },
  { Id: 'ORD-2026-002', OrganizationId: 'org-1', TotalPrice: '28.00', TableId: 'T002', Created: new Date('2026-02-10T14:15:00.000Z') },
  { Id: 'ORD-2026-003', OrganizationId: 'org-1', TotalPrice: '67.80', TableId: 'T003', Created: new Date('2026-02-10T13:45:00.000Z') },
  { Id: 'ORD-2026-004', OrganizationId: 'org-1', TotalPrice: '32.50', TableId: 'T004', Created: new Date('2026-02-10T13:30:00.000Z') },
  { Id: 'ORD-2026-005', OrganizationId: 'org-1', TotalPrice: '54.20', TableId: 'T005', Created: new Date('2026-02-10T12:50:00.000Z') },
  { Id: 'ORD-2026-006', OrganizationId: 'org-1', TotalPrice: '22.00', TableId: 'T006', Created: new Date('2026-02-10T12:30:00.000Z') },
  { Id: 'ORD-2026-007', OrganizationId: 'org-1', TotalPrice: '89.90', TableId: 'T007', Created: new Date('2026-02-10T11:45:00.000Z') },
  { Id: 'ORD-2026-008', OrganizationId: 'org-1', TotalPrice: '48.50', TableId: 'T008', Created: new Date('2026-02-09T19:20:00.000Z') },
  { Id: 'ORD-2026-009', OrganizationId: 'org-1', TotalPrice: '36.00', TableId: 'T001', Created: new Date('2026-02-09T18:55:00.000Z') },
  { Id: 'ORD-2026-010', OrganizationId: 'org-1', TotalPrice: '62.40', TableId: 'T002', Created: new Date('2026-02-09T18:30:00.000Z') },
  { Id: 'ORD-2026-011', OrganizationId: 'org-1', TotalPrice: '75.30', TableId: 'T003', Created: new Date('2026-02-09T17:15:00.000Z') },
  { Id: 'ORD-2026-012', OrganizationId: 'org-1', TotalPrice: '41.20', TableId: 'T004', Created: new Date('2026-02-09T16:45:00.000Z') },
  { Id: 'ORD-2026-013', OrganizationId: 'org-1', TotalPrice: '58.90', TableId: 'T005', Created: new Date('2026-02-09T15:30:00.000Z') },
  { Id: 'ORD-2026-014', OrganizationId: 'org-1', TotalPrice: '33.50', TableId: 'T006', Created: new Date('2026-02-09T14:20:00.000Z') },
  { Id: 'ORD-2026-015', OrganizationId: 'org-1', TotalPrice: '92.00', TableId: 'T007', Created: new Date('2026-02-09T13:10:00.000Z') },
  { Id: 'ORD-2026-016', OrganizationId: 'org-1', TotalPrice: '64.80', TableId: 'T008', Created: new Date('2026-02-08T19:45:00.000Z') },
  { Id: 'ORD-2026-017', OrganizationId: 'org-1', TotalPrice: '27.50', TableId: 'T001', Created: new Date('2026-02-08T18:30:00.000Z') },
  { Id: 'ORD-2026-018', OrganizationId: 'org-1', TotalPrice: '51.40', TableId: 'T002', Created: new Date('2026-02-08T17:20:00.000Z') },
  { Id: 'ORD-2026-019', OrganizationId: 'org-1', TotalPrice: '38.60', TableId: 'T003', Created: new Date('2026-02-08T16:15:00.000Z') },
  { Id: 'ORD-2026-020', OrganizationId: 'org-1', TotalPrice: '71.20', TableId: 'T004', Created: new Date('2026-02-08T15:00:00.000Z') },
];

export const MOCK_HISTORY_ORDER_PRODUCTS_API: OrderProduct[] = MOCK_HISTORY_ORDERS_API.flatMap((order, index) => [
  {
    Id: `${order.Id}-P1`,
    OrderId: order.Id,
    ProductId: `product-${(index % 6) + 1}`,
    TotalPrice: Number(order.TotalPrice) * 0.65,
    Created: now,
  },
  {
    Id: `${order.Id}-P2`,
    OrderId: order.Id,
    ProductId: `product-${((index + 1) % 6) + 1}`,
    TotalPrice: Number(order.TotalPrice) * 0.35,
    Created: now,
  },
]);
