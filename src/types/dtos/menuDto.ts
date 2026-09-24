import { MenuCategoryDto } from "./menuCategoryDto";
import { MenuProductDto } from "./menuProductDto";

export interface MenuDto {
    id: string,
    organizationId: string,
    enabled: boolean,
    name: string,
    patternStartTime: Date | null,
    patternEndTime: Date | null,
    eventStartTime: Date | null,
    eventEndTime: Date | null,
    menuCategories: MenuCategoryDto[],
    menuProducts: MenuProductDto[],
}