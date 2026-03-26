import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { mapGraphQLProductToProduct } from '../graphql/mappers';
import { toProductListItemViewModel, type ProductListItemViewModel } from '../../viewModels';
import { useOrganizationId } from './organization.hooks';
import { Dietary } from '../types';

const PRODUCTS_QUERY = gql`
  query GetProducts($organizationId: ID!) {
    products(organizationId: $organizationId) {
      id
      name
      description
      organizationId
      price
      oldPrice
      toppings
      ingredients
      dietaries
      freeToppings
      excludables
      imgUrl
      enabled
      created
      ageRestricted
    }
  }
`;

const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      success
      message
      product {
        id
      }
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      success
      message
      product {
        id
      }
    }
  }
`;

const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      success
      message
    }
  }
`;

interface ProductsQueryData {
  products: Array<{
    id: string;
    name: string;
    description?: string | null;
    organizationId: string;
    price: number;
    oldPrice?: number | null;
    toppings?: string | null;
    ingredients?: string | null;
    dietaries?: number[] | null;
    freeToppings: number;
    excludables?: string | null;
    imgUrl?: string | null;
    enabled: boolean;
    created: string;
    ageRestricted: boolean;
  }>;
}

interface ProductsQueryVariables {
  organizationId: string;
}

type MutationResponse = {
  success: boolean;
  message: string;
};

interface CreateProductMutationData {
  createProduct?: MutationResponse | null;
}

interface UpdateProductMutationData {
  updateProduct?: MutationResponse | null;
}

interface DeleteProductMutationData {
  deleteProduct?: MutationResponse | null;
}

const dietaryByNumericValue: Record<number, 'GlutenFree' | 'LactoseFree' | 'LowLactose' | 'Vegetarian' | 'Vegan'> = {
  [Dietary.GlutenFree]: 'GlutenFree',
  [Dietary.LactoseFree]: 'LactoseFree',
  [Dietary.LowLactose]: 'LowLactose',
  [Dietary.Vegetarian]: 'Vegetarian',
  [Dietary.Vegan]: 'Vegan',
};

const mapDietariesToGraphQLEnum = (dietaries?: number[]) => {
  if (!dietaries || dietaries.length === 0) {
    return undefined;
  }

  return dietaries
    .map((dietary) => dietaryByNumericValue[dietary])
    .filter((dietary): dietary is 'GlutenFree' | 'LactoseFree' | 'LowLactose' | 'Vegetarian' | 'Vegan' => Boolean(dietary));
};

export interface SaveProductInput {
  id?: string;
  name: string;
  description?: string;
  organizationId?: string;
  price: number;
  oldPrice?: number;
  toppings?: string;
  ingredients?: string;
  dietaries?: number[];
  freeToppings?: number;
  excludables?: string;
  imgUrl?: string;
  enabled?: boolean;
  ageRestricted?: boolean;
}

export const useGetProducts = () => {
  const { organizationId, loading: organizationLoading, error: organizationError } = useOrganizationId();

  const [createProductMutation] = useMutation<CreateProductMutationData>(CREATE_PRODUCT_MUTATION);
  const [updateProductMutation] = useMutation<UpdateProductMutationData>(UPDATE_PRODUCT_MUTATION);
  const [deleteProductMutation] = useMutation<DeleteProductMutationData>(DELETE_PRODUCT_MUTATION);

  const { data, loading, error } = useQuery<ProductsQueryData, ProductsQueryVariables>(PRODUCTS_QUERY, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId,
  });

  const productItems = useMemo<ProductListItemViewModel[]>(
    () => (data?.products ?? []).map(mapGraphQLProductToProduct).map(toProductListItemViewModel),
    [data]
  );

  const createProduct = async (input: SaveProductInput) => {
    if (!organizationId) {
      return { success: false, message: 'Organization not resolved' };
    }

    const response = await createProductMutation({
      variables: {
        input: {
          name: input.name,
          description: input.description,
          organizationId,
          price: input.price,
          oldPrice: input.oldPrice,
          toppings: input.toppings,
          ingredients: input.ingredients,
          dietaries: mapDietariesToGraphQLEnum(input.dietaries),
          freeToppings: input.freeToppings ?? 0,
          excludables: input.excludables,
          imgUrl: input.imgUrl,
          enabled: input.enabled ?? true,
          ageRestricted: input.ageRestricted ?? false,
        },
      },
      refetchQueries: [{ query: PRODUCTS_QUERY, variables: { organizationId } }],
      awaitRefetchQueries: true,
    });

    const payload = response.data?.createProduct;
    return {
      success: Boolean(payload?.success),
      message: payload?.message ?? 'Failed to create product',
    };
  };

  const updateProduct = async (input: SaveProductInput) => {
    if (!organizationId || !input.id) {
      return { success: false, message: 'Missing product id or organization context' };
    }

    const response = await updateProductMutation({
      variables: {
        input: {
          id: input.id,
          name: input.name,
          description: input.description,
          price: input.price,
          oldPrice: input.oldPrice,
          toppings: input.toppings,
          ingredients: input.ingredients,
          dietaries: mapDietariesToGraphQLEnum(input.dietaries),
          freeToppings: input.freeToppings,
          excludables: input.excludables,
          imgUrl: input.imgUrl,
          enabled: input.enabled,
          ageRestricted: input.ageRestricted,
        },
      },
      refetchQueries: [{ query: PRODUCTS_QUERY, variables: { organizationId } }],
      awaitRefetchQueries: true,
    });

    const payload = response.data?.updateProduct;
    return {
      success: Boolean(payload?.success),
      message: payload?.message ?? 'Failed to update product',
    };
  };

  const deleteProduct = async (id: string) => {
    if (!organizationId) {
      return { success: false, message: 'Organization not resolved' };
    }

    const response = await deleteProductMutation({
      variables: { id },
      refetchQueries: [{ query: PRODUCTS_QUERY, variables: { organizationId } }],
      awaitRefetchQueries: true,
    });

    const payload = response.data?.deleteProduct;
    return {
      success: Boolean(payload?.success),
      message: payload?.message ?? 'Failed to delete product',
    };
  };

  return {
    data: productItems,
    loading: organizationLoading || loading,
    error: organizationError ?? error,
    createProduct,
    updateProduct,
    deleteProduct,
  } as const;
};
