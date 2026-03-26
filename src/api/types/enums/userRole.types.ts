export const UserRole = {
    User: 0,
    RestaurantUser: 1,
    RestaurantAdmin: 2,
    RestaurantManager: 3,
    Superuser: 4,
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export type UserRoleName = keyof typeof UserRole;
