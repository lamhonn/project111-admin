import { MenuProduct } from "../models";
import { MenuCategoryViewModel } from "./menuCategoryViewModel";

export interface MenuViewModel {
    Id: string,
    OrganizationId: string,
    Enabled: boolean,
    Name: string,
    PatternStartTime: Date | null,
    PatternEndTime: Date | null,
    EventStartTime: Date | null,
    EventEndTime: Date | null,
    MenuCategories: MenuCategoryViewModel[],
    MenuProducts: MenuProduct[],
    Created: Date,
}