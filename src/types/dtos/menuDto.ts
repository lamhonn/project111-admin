import { MenuCategoryDto } from "./menuCategoryDto";
import { MenuProductDto } from "./menuProductDto";

export interface MenuDto {
    Id: string,
    OrganizationId: string,
    Enabled: boolean,
    Name: string,
    PatternStartTime: Date | null,
    PatternEndTime: Date | null,
    EventStartTime: Date | null,
    EventEndTime: Date | null,
    MenuCategories: MenuCategoryDto[],
    MenuProducts: MenuProductDto[],
}