export const UserRole = {
    User: 0,
    RestaurantUser: 1,
    RestaurantManager: 2,
    RestaurantAdmin: 3,
    Superuser: 4,
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export type UserRoleName = keyof typeof UserRole;
