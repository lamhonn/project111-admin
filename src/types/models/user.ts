import { UserRole } from "../enums"
import { Organization } from "./organization"

export type User = {
    id: string,
    organizationId: string,
    organization: Organization,
    login: string,
    name: string,
    password: string,
    email: string,
    role: UserRole // enum
    maxDevices: number,
    created: Date,
}
