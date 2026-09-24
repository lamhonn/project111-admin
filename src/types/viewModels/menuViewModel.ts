import { MenuProduct } from "../models";
import { MenuCategoryViewModel } from "./menuCategoryViewModel";

export interface MenuViewModel {
    id: string,
    organizationId: string,
    enabled: boolean,
    name: string,
    patternStartTime: Date | null,
    patternEndTime: Date | null,
    eventStartTime: Date | null,
    eventEndTime: Date | null,
    menuCategories: MenuCategoryViewModel[],
    menuProducts: MenuProduct[],
    created: Date,
}