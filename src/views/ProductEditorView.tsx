import { Box, Typography } from '@mui/material';
import { theme } from '../theme';
import { useState } from 'react';
import ProductEditorHeader from '../components/productEditor/ProductEditorHeader';
import ProductGrid from '../components/productEditor/ProductGrid';
import EditProductDialog from '../components/productEditor/EditProductDialog';
import ErrorDialog from '../components/common/ErrorDialog';
import type { ProductListItemViewModel } from '../viewModels';
import { useGetProducts } from '../api/hooks/product.hooks';

type ProductTranslations = {
  productName?: Record<'fi' | 'en' | 'sv', string>;
  description?: Record<'fi' | 'en' | 'sv', string>;
  ingredients?: Record<'fi' | 'en' | 'sv', string>;
};

type ProductDialogData = {
  productName?: string;
  description?: string;
  ingredients?: string;
  productTranslations?: ProductTranslations;
  ImgUrl?: string;
  stockPhotoLink?: string;
  toppings?: Array<{ name?: string; priceIncrement?: number }>;
  excludables?: string[];
  freeToppings?: number;
  maxToppings?: number;
  enabled?: boolean;
  ageRestricted?: boolean;
  price?: number;
};

const stringifyTranslations = (
  fallbackValue: string | undefined,
  translations?: Record<'fi' | 'en' | 'sv', string>
): string | undefined => {
  if (translations && Object.values(translations).some((value) => value.trim().length > 0)) {
    return JSON.stringify(translations);
  }

  const trimmed = fallbackValue?.trim();
  return trimmed ? JSON.stringify({ en: trimmed }) : undefined;
};

export default function ProductEditorView() {
  const { data: products, createProduct, updateProduct, deleteProduct } = useGetProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductListItemViewModel | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleProductClick = (id: string) => {
    const product = filteredProducts.find((item) => item.id === id);
    if (product) {
      setSelectedProduct(product);
      setDialogOpen(true);
    }
  };

  const handleSaveProduct = async (data: any) => {
    try {
      const productData = data as ProductDialogData;
      const basePayload = {
        name:
          stringifyTranslations(productData.productName, productData.productTranslations?.productName) ??
          productData.productName?.trim() ??
          '',
        description: stringifyTranslations(productData.description, productData.productTranslations?.description),
        ingredients: stringifyTranslations(productData.ingredients, productData.productTranslations?.ingredients),
        price: productData.price ?? selectedProduct?.price ?? 0,
        toppings: JSON.stringify(productData.toppings ?? selectedProduct?.toppings ?? []),
        excludables: JSON.stringify(productData.excludables ?? selectedProduct?.excludables ?? []),
        freeToppings: productData.freeToppings ?? selectedProduct?.freeToppings ?? 0,
        maxToppings: productData.maxToppings ?? selectedProduct?.maxToppings ?? 0,
        dietaries: selectedProduct?.dietaries,
        imgUrl: productData.stockPhotoLink ?? productData.ImgUrl ?? selectedProduct?.imgUrl,
        enabled: productData.enabled ?? selectedProduct?.enabled ?? true,
        ageRestricted: productData.ageRestricted ?? selectedProduct?.ageRestricted ?? false,
      };

      if (selectedProduct?.id) {
        const result = await updateProduct({
          id: selectedProduct.id,
          ...basePayload,
        });

        if (!result.success) {
          throw new Error(result.message);
        }
        return;
      }

      console.log('Creating product with payload:', basePayload);
      const result = await createProduct(basePayload);
      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
      throw error;
    }
  };

  const handleDeleteProduct = async () => {
    try {
      if (selectedProduct) {
        const result = await deleteProduct(selectedProduct.id);
        if (!result.success) {
          throw new Error(result.message);
        }
      }
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
      throw error;
    }
  };

  return (
    <Box sx={{ p: theme.spacing.lg, width: '100%', bgcolor: theme.colors.background, minHeight: '100vh' }}>
      <ProductEditorHeader
        onAddProduct={handleAddProduct}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {products.length === 0 ? (
        <Typography variant="body1" sx={{ color: theme.colors.text }}>
          No products configured
        </Typography>
      ) : (
        <ProductGrid
          products={filteredProducts}
          onProductClick={handleProductClick}
        />
      )}

      <EditProductDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveProduct}
        onDelete={selectedProduct ? handleDeleteProduct : undefined}
        initialData={selectedProduct ? {
          productName: selectedProduct.name,
          description: selectedProduct.description,
          ingredients: selectedProduct.ingredients,
          ImgUrl: selectedProduct.imgUrl,
          toppings: selectedProduct.toppings,
          excludables: selectedProduct.excludables,
          freeToppings: selectedProduct.freeToppings,
          maxToppings: selectedProduct.maxToppings,
          ageRestricted: selectedProduct.ageRestricted,
          price: selectedProduct.price,
        } : undefined}
      />

      <ErrorDialog
        open={Boolean(errorMessage)}
        errorMessage={errorMessage ?? ''}
        onClose={() => setErrorMessage(null)}
      />
    </Box>
  );
}
