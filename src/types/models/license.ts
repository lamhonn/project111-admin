import { Organization } from "./organization";

export interface License {
    id: string,
    organizationId: string,
    organization: Organization,
    maxUsers: number,
    expires: Date,
    enabled: boolean,
    created: Date,
}