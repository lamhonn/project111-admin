import { atom } from 'jotai';
import type { MenuCategory } from '../components/menuEditor/types';

export interface MenuEditorCategoryState {
  id: string;
  name: string;
  showTopmost: boolean;
}

export interface MenuEditorState {
  categories: MenuEditorCategoryState[];
  productsByCategoryId: Record<string, string[]>;
}

const EMPTY_MENU_EDITOR_STATE: MenuEditorState = {
  categories: [],
  productsByCategoryId: {},
};

export const menuEditorStateAtom = atom<MenuEditorState>(EMPTY_MENU_EDITOR_STATE);

export const initializeMenuEditorStateAtom = atom(
  null,
  (_, set, categories: MenuCategory[] = []) => {
    const nextCategories: MenuEditorCategoryState[] = categories.map((category) => ({
      id: category.id,
      name: category.name,
      showTopmost: Boolean(category.showTopmost),
    }));

    const nextProductsByCategoryId = categories.reduce<Record<string, string[]>>((result, category) => {
      result[category.id] = (category.items || []).map((item) => item.id);
      return result;
    }, {});

    set(menuEditorStateAtom, {
      categories: nextCategories,
      productsByCategoryId: nextProductsByCategoryId,
    });
  }
);

export const upsertMenuEditorCategoryAtom = atom(
  null,
  (get, set, payload: { id?: string; name: string; showTopmost: boolean }) => {
    const currentState = get(menuEditorStateAtom);
    const categoryId = payload.id || `category-${Date.now()}`;

    const existingCategoryIndex = currentState.categories.findIndex((category) => category.id === categoryId);
    const nextCategory: MenuEditorCategoryState = {
      id: categoryId,
      name: payload.name,
      showTopmost: payload.showTopmost,
    };

    const nextCategories =
      existingCategoryIndex === -1
        ? [...currentState.categories, nextCategory]
        : currentState.categories.map((category) =>
            category.id === categoryId ? nextCategory : category
          );

    set(menuEditorStateAtom, {
      categories: nextCategories,
      productsByCategoryId: {
        ...currentState.productsByCategoryId,
        [categoryId]: currentState.productsByCategoryId[categoryId] || [],
      },
    });
  }
);

export const setMenuEditorCategoryProductsAtom = atom(
  null,
  (get, set, payload: { categoryId: string; productIds: string[] }) => {
    const currentState = get(menuEditorStateAtom);

    set(menuEditorStateAtom, {
      ...currentState,
      productsByCategoryId: {
        ...currentState.productsByCategoryId,
        [payload.categoryId]: payload.productIds,
      },
    });
  }
);

export const deleteMenuEditorCategoryAtom = atom(
  null,
  (get, set, categoryId: string) => {
    const currentState = get(menuEditorStateAtom);
    const { [categoryId]: _removed, ...remainingProductsByCategoryId } = currentState.productsByCategoryId;

    set(menuEditorStateAtom, {
      categories: currentState.categories.filter((category) => category.id !== categoryId),
      productsByCategoryId: remainingProductsByCategoryId,
    });
  }
);