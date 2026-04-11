import { gql } from '@apollo/client';
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { mapGraphQLMenuProductToMenuProduct, mapGraphQLMenuToMenu } from '../graphql/mappers';
import {
  toMenuDataViewModel,
  toMenuListItemViewModel,
  type MenuDataViewModel,
  type MenuListItemViewModel,
} from '../../viewModels';
import { useOrganizationId } from './organization.hooks';

const MENUS_QUERY = gql`
  query GetMenus($organizationId: ID!) {
    menus(organizationId: $organizationId) {
      id
      organizationId
      name
      enabled
      categories
      patternStartTime
      patternEndTime
      eventStartTime
      eventEndTime
      created
      products {
        id
        menuId
        productId
        categoryId
        created
      }
    }
  }
`;

const MENU_PRODUCTS_QUERY = gql`
  query GetMenuProducts($menuId: ID!) {
    menuProducts(menuId: $menuId) {
      id
      menuId
      productId
      categoryId
      created
    }
  }
`;

const CREATE_MENU_MUTATION = gql`
  mutation CreateMenu($input: CreateMenuInput!) {
    createMenu(input: $input) {
      success
      message
      menu {
        id
      }
    }
  }
`;

const UPDATE_MENU_MUTATION = gql`
  mutation UpdateMenu($input: UpdateMenuInput!) {
    updateMenu(input: $input) {
      success
      message
      menu {
        id
      }
    }
  }
`;

const DELETE_MENU_MUTATION = gql`
  mutation DeleteMenu($id: ID!) {
    deleteMenu(id: $id) {
      success
      message
    }
  }
`;

const CREATE_MENU_PRODUCT_MUTATION = gql`
  mutation CreateMenuProduct($input: CreateMenuProductInput!) {
    createMenuProduct(input: $input) {
      success
      message
      menuProduct {
        id
      }
    }
  }
`;

const DELETE_MENU_PRODUCT_MUTATION = gql`
  mutation DeleteMenuProduct($id: ID!) {
    deleteMenuProduct(id: $id) {
      success
      message
    }
  }
`;

interface MenusQueryData {
  menus: Array<{
    id: string;
    organizationId: string;
    name: string;
    enabled: boolean;
    categories: string;
    patternStartTime?: string | null;
    patternEndTime?: string | null;
    eventStartTime?: string | null;
    eventEndTime?: string | null;
    created: string;
    products?: Array<{
      id: string;
      menuId: string;
      productId: string;
      categoryId: string;
      created: string;
    }>;
  }>;
}

interface MenuProductsQueryData {
  menuProducts: Array<{
    id: string;
    menuId: string;
    productId: string;
    categoryId: string;
    created: string;
  }>;
}

interface MenusQueryVariables {
  organizationId: string;
}

type MutationResponse = {
  success: boolean;
  message: string;
};

type MutationWithMenuResponse = MutationResponse & {
  menu?: {
    id: string;
  } | null;
};

interface CreateMenuMutationData {
  createMenu?: MutationWithMenuResponse | null;
}

interface UpdateMenuMutationData {
  updateMenu?: MutationWithMenuResponse | null;
}

interface DeleteMenuMutationData {
  deleteMenu?: MutationResponse | null;
}

interface CreateMenuProductMutationData {
  createMenuProduct?: MutationResponse | null;
}

interface DeleteMenuProductMutationData {
  deleteMenuProduct?: MutationResponse | null;
}

export interface SaveMenuInput {
  id?: string;
  name: string;
  enabled: boolean;
  categories: string;
  menuProducts: Array<{
    productId: string;
    categoryId: string;
  }>;
}

export const useGetMenus = () => {
  const apolloClient = useApolloClient();
  const { organizationId, loading: organizationLoading, error: organizationError } = useOrganizationId();

  const [createMenuMutation] = useMutation<CreateMenuMutationData>(CREATE_MENU_MUTATION);
  const [updateMenuMutation] = useMutation<UpdateMenuMutationData>(UPDATE_MENU_MUTATION);
  const [deleteMenuMutation] = useMutation<DeleteMenuMutationData>(DELETE_MENU_MUTATION);
  const [createMenuProductMutation] = useMutation<CreateMenuProductMutationData>(CREATE_MENU_PRODUCT_MUTATION);
  const [deleteMenuProductMutation] = useMutation<DeleteMenuProductMutationData>(DELETE_MENU_PRODUCT_MUTATION);

  const { data, loading, error, refetch } = useQuery<MenusQueryData, MenusQueryVariables>(MENUS_QUERY, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId,
  });

  const menuListItems = useMemo<MenuListItemViewModel[]>(
    () => (data?.menus ?? []).map(mapGraphQLMenuToMenu).map(toMenuListItemViewModel),
    [data]
  );

  const menus = useMemo<MenuDataViewModel[]>(
    () =>
      (data?.menus ?? []).map((menu) =>
        toMenuDataViewModel(
          mapGraphQLMenuToMenu(menu),
          (menu.products ?? []).map(mapGraphQLMenuProductToMenuProduct)
        )
      ),
    [data]
  );

  const saveMenuProducts = async (
    menuId: string,
    menuProducts: SaveMenuInput['menuProducts'],
    replaceExisting: boolean
  ) => {
    const uniqueMenuProducts = Array.from(
      new Map(menuProducts.map((item) => [`${item.categoryId}:${item.productId}`, item])).values()
    );

    if (replaceExisting) {
      const existingProductsResponse = await apolloClient.query<MenuProductsQueryData>({
        query: MENU_PRODUCTS_QUERY,
        variables: { menuId },
        fetchPolicy: 'network-only',
      });
      const existingProducts = existingProductsResponse.data?.menuProducts ?? [];

      for (const existingProduct of existingProducts) {
        const deleteResponse = await deleteMenuProductMutation({
          variables: { id: existingProduct.id },
        });
        const deletePayload = deleteResponse.data?.deleteMenuProduct;

        if (!deletePayload?.success) {
          throw new Error(deletePayload?.message ?? 'Failed to delete menu products');
        }
      }
    }

    for (const menuProduct of uniqueMenuProducts) {
      const createResponse = await createMenuProductMutation({
        variables: {
          input: {
            menuId,
            productId: menuProduct.productId,
            categoryId: menuProduct.categoryId,
          },
        },
      });
      const createPayload = createResponse.data?.createMenuProduct;

      if (!createPayload?.success) {
        throw new Error(createPayload?.message ?? 'Failed to save menu products');
      }
    }
  };

  const createMenu = async (input: SaveMenuInput) => {
    if (!organizationId) {
      return { success: false, message: 'Organization not resolved' };
    }

    const response = await createMenuMutation({
      variables: {
        input: {
          organizationId,
          name: input.name,
          enabled: input.enabled,
          categories: input.categories,
        },
      },
    });

    const payload = response.data?.createMenu;

    if (payload?.success && response.data?.createMenu && input.menuProducts.length > 0) {
      const createdMenuId = response.data.createMenu.menu?.id;
      if (!createdMenuId) {
        throw new Error('Created menu id missing from response');
      }

      await saveMenuProducts(createdMenuId, input.menuProducts, false);
    }

    if (payload?.success) {
      await refetch({ organizationId });
    }

    return {
      success: Boolean(payload?.success),
      message: payload?.message ?? 'Failed to create menu',
    };
  };

  const updateMenu = async (input: SaveMenuInput) => {
    if (!organizationId || !input.id) {
      return { success: false, message: 'Missing menu id or organization context' };
    }

    const response = await updateMenuMutation({
      variables: {
        input: {
          id: input.id,
          name: input.name,
          enabled: input.enabled,
          categories: input.categories,
        },
      },
    });

    const payload = response.data?.updateMenu;

    if (payload?.success) {
      await saveMenuProducts(input.id, input.menuProducts, true);
      await refetch({ organizationId });
    }

    return {
      success: Boolean(payload?.success),
      message: payload?.message ?? 'Failed to update menu',
    };
  };

  const deleteMenu = async (id: string) => {
    if (!organizationId) {
      return { success: false, message: 'Organization not resolved' };
    }

    const response = await deleteMenuMutation({
      variables: { id },
    });

    const payload = response.data?.deleteMenu;

    if (payload?.success) {
      await refetch({ organizationId });
    }

    return {
      success: Boolean(payload?.success),
      message: payload?.message ?? 'Failed to delete menu',
    };
  };

  return {
    data: menuListItems,
    editorData: menus,
    loading: organizationLoading || loading,
    error: organizationError ?? error,
    createMenu,
    updateMenu,
    deleteMenu,
  } as const;
};
