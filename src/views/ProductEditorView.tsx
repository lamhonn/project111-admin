import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { theme } from '../theme';
import ProductEditorHeader from '../components/productEditor/ProductEditorHeader';
import EditProductDialog from '../components/productEditor/EditProductDialog';
import { editProductDialogOpenAtom, errorAtom, getProductsByOrganizationIdAtom, loadingAtom, productsAtom } from '../state/productStore';
import ProductEditorCard from '../components/productEditor/ProductEditorCard';
import { organizationIdAtom } from '../state/authStore';
import { Product } from '../types/models';

export default function ProductEditorView() {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');

  const loading = useAtomValue(loadingAtom);

  const organizationId = useAtomValue(organizationIdAtom);

  const defaultProduct: Product = {
    id: crypto.randomUUID(),
    description: '{ "fi": "", "en": "", "sv": "" }',
    name: '{ "fi": "", "en": "", "sv": "" }',
    dietaries: [],
    freeToppings: 0,
    imgUrl: "",
    ingredients: '{ "fi": "", "en": "", "sv": "" }',
    organizationId: organizationId ?? "",
    price: 0,
    productExcludables: [],
    productToppings: [],
    created: new Date()
  };

  const products = useAtomValue(productsAtom);
  const getProducts = useSetAtom(getProductsByOrganizationIdAtom);

  const [selectedProduct, setSelectedProduct] = useState<Product>(defaultProduct);
  const [editProductDialogOpen, setEditProductDialogOpen] = useAtom(editProductDialogOpenAtom);

  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery])

  // FIXME: doesn't work reliably
  const handleClickProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditProductDialogOpen(true);  
  }

  const handleAddProduct = () => {
    setSelectedProduct(defaultProduct);
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
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr',
                  md: '1fr',
                },
                gap: theme.spacing.lg,
              }}
            >
              {filteredProducts.map((product) => (
                <ProductEditorCard
                  key={product.id}
                  product={product}
                  onClick={() => handleClickProduct(product)}
                />
              ))}
            </Box>
          )}
        </>
      }

      <EditProductDialog
        open={editProductDialogOpen}
        onClose={() => setEditProductDialogOpen(false)}
        product={selectedProduct}
      />
    </Box>
  );
}
