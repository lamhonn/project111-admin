import type { Menu } from '../types';

const now = new Date('2026-02-24T10:00:00.000Z');

export const MOCK_MENUS: Menu[] = [
  {
    Id: 'menu-1',
    OrganizationId: 'org-1',
    Name: 'Breakfast Menu',
    Enabled: true,
    Categories: ['Breakfast'],
    Created: now,
  },
  {
    Id: 'menu-2',
    OrganizationId: 'org-1',
    Name: 'Lunch Menu',
    Enabled: true,
    Categories: ['Lunch'],
    Created: now,
  },
  {
    Id: 'menu-3',
    OrganizationId: 'org-1',
    Name: 'Dinner Menu',
    Enabled: true,
    Categories: ['Dinner'],
    Created: now,
  },
  {
    Id: 'menu-4',
    OrganizationId: 'org-1',
    Name: 'Drinks Menu',
    Enabled: true,
    Categories: ['Drinks'],
    Created: now,
  },
  {
    Id: 'menu-5',
    OrganizationId: 'org-1',
    Name: 'Desserts Menu',
    Enabled: false,
    Categories: ['Desserts'],
    Created: now,
  },
  {
    Id: 'menu-6',
    OrganizationId: 'org-1',
    Name: 'Specials Menu',
    Enabled: true,
    Categories: ['Specials'],
    Created: now,
  },
];
