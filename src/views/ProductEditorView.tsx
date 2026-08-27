import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { theme } from '../theme';
import ProductEditorHeader from '../components/productEditor/ProductEditorHeader';
import ProductGrid from '../components/productEditor/ProductGrid';
import EditProductDialog from '../components/productEditor/EditProductDialog';
import { editProductDialogOpenAtom, errorAtom, getProductsByOrganizationIdAtom, loadingAtom, productsAtom, selectedProductAtom, selectedProductIdAtom } from '../state/productStore';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');

  const loading = useAtomValue(loadingAtom);

  const products = useAtomValue(productsAtom);
  const getProducts = useSetAtom(getProductsByOrganizationIdAtom);

  const setSelectedProduct = useSetAtom(selectedProductAtom);
  const setSelectedProductId = useSetAtom(selectedProductIdAtom);
  const [editProductDialogOpen, setEditProductDialogOpen] = useAtom(editProductDialogOpenAtom);

  const filteredProducts = products.filter((product) =>
    product.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    getProducts();
  }, []);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setSelectedProductId('');
    setEditProductDialogOpen(true);
  };

  return (
    <Box sx={{ p: theme.spacing.lg, width: '100%', bgcolor: theme.colors.background, minHeight: '100vh' }}>
      {loading ?
        <CircularProgress />
        :
        <>
          <ProductEditorHeader
            onAddProduct={handleAddProduct}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
  
          {products.length === 0 ? (
            <Typography variant="body1" sx={{ color: theme.colors.text }}>
              {t(`admin.productEditor.dialog.noProducts`)}
            </Typography>
          ) : (
            <ProductGrid
              products={filteredProducts}
            />
          )}
        </>
      }

      <EditProductDialog
        open={editProductDialogOpen}
        onClose={() => setEditProductDialogOpen(false)}
      />
    </Box>
  );
}
