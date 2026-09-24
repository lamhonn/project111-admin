import { License } from "./license";
import { User } from "./user";

export interface Organization {
    id: string,
    licenseId: string | null,
    license: License | null,
    users: User[],
    primaryUserId: string | null,
    primaryUser: User | null,
    name: string,
    maxUsers: number,
    created: Date,
}
