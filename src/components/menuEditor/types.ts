export interface MenuCategoryItem {
  id: number;
  name: string;
}

export interface MenuCategory {
  id: number;
  name: string;
  items: MenuCategoryItem[];
}

export interface ProductOption {
  id: number;
  name: string;
}

export interface MenuData {
  menuName?: string;
  description?: string;
  isActive?: boolean;
  activeDays?: string[];
  activeFrom?: string;
  activeTo?: string;
  categories?: MenuCategory[];
  [key: string]: any;
}
