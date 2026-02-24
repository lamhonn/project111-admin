import type { Table } from '../types';

const now = new Date('2026-02-24T10:00:00.000Z');

export const MOCK_TABLES: Table[] = [
  { Id: 'T001', OrganizationId: 'org-1', TableNumber: 1, Created: now },
  { Id: 'T002', OrganizationId: 'org-1', TableNumber: 2, Created: now },
  { Id: 'T003', OrganizationId: 'org-1', TableNumber: 3, Created: now },
  { Id: 'T004', OrganizationId: 'org-1', TableNumber: 4, Created: now },
  { Id: 'T005', OrganizationId: 'org-1', TableNumber: 5, Created: now },
  { Id: 'T006', OrganizationId: 'org-1', TableNumber: 6, Created: now },
  { Id: 'T007', OrganizationId: 'org-1', TableNumber: 7, Created: now },
  { Id: 'T008', OrganizationId: 'org-1', TableNumber: 8, Created: now },
];
