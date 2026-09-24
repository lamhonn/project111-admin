export type PairingSession = {
    id: string,
    userId: string,
    organizationId: string,
    pin: string;
    expires: Date;
}