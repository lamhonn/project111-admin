import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { mapGraphQLMenuToMenu } from '../graphql/mappers';
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
      topmostCategory
      patternStartTime
      patternEndTime
      eventStartTime
      eventEndTime
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

interface MenusQueryData {
  menus: Array<{
    id: string;
    organizationId: string;
    name: string;
    enabled: boolean;
    categories: string;
    topmostCategory?: boolean | null;
    patternStartTime?: string | null;
    patternEndTime?: string | null;
    eventStartTime?: string | null;
    eventEndTime?: string | null;
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

interface CreateMenuMutationData {
  createMenu?: MutationResponse | null;
}

interface UpdateMenuMutationData {
  updateMenu?: MutationResponse | null;
}

interface DeleteMenuMutationData {
  deleteMenu?: MutationResponse | null;
}

export interface SaveMenuInput {
  id?: string;
  name: string;
  enabled: boolean;
  categories: string;
  topmostCategory?: boolean;
}

export const useGetMenus = () => {
  const { organizationId, loading: organizationLoading, error: organizationError } = useOrganizationId();

  const [createMenuMutation] = useMutation<CreateMenuMutationData>(CREATE_MENU_MUTATION);
  const [updateMenuMutation] = useMutation<UpdateMenuMutationData>(UPDATE_MENU_MUTATION);
  const [deleteMenuMutation] = useMutation<DeleteMenuMutationData>(DELETE_MENU_MUTATION);

  const { data, loading, error } = useQuery<MenusQueryData, MenusQueryVariables>(MENUS_QUERY, {
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
    () => (data?.menus ?? []).map(mapGraphQLMenuToMenu).map((menu) => toMenuDataViewModel(menu)),
    [data]
  );

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
          topmostCategory: input.topmostCategory,
        },
      },
      refetchQueries: [{ query: MENUS_QUERY, variables: { organizationId } }],
      awaitRefetchQueries: true,
    });

    const payload = response.data?.createMenu;
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
          topmostCategory: input.topmostCategory,
        },
      },
      refetchQueries: [{ query: MENUS_QUERY, variables: { organizationId } }],
      awaitRefetchQueries: true,
    });

    const payload = response.data?.updateMenu;
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
      refetchQueries: [{ query: MENUS_QUERY, variables: { organizationId } }],
      awaitRefetchQueries: true,
    });

    const payload = response.data?.deleteMenu;
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
