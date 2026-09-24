import { MenuCategory } from "./menuCategory";
import { MenuProduct } from "./menuProduct";

export interface Menu {
    id: string,
    organizationId: string,
    enabled: boolean,
    name: string,
    patternStartTime: Date | null,
    patternEndTime: Date | null,
    eventStartTime: Date | null,
    eventEndTime: Date | null,
    menuCategories: MenuCategory[],
    menuProducts: MenuProduct[],
    created: Date,
}
