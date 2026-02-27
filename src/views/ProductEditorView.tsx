import { Box, Typography } from '@mui/material';
import { theme } from '../theme';
import { useState } from 'react';
import ProductEditorHeader from '../components/productEditor/ProductEditorHeader';
import ProductGrid from '../components/productEditor/ProductGrid';
import EditProductDialog from '../components/productEditor/EditProductDialog';
import type { ProductListItemViewModel } from '../viewModels';
import { useGetProducts } from '../api/hooks/product.hooks';

export default function ProductEditorView() {
  const { data: products } = useGetProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductListItemViewModel | null>(null);

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

  const handleSaveProduct = (data: any) => {
    // TODO: Implement save product functionality
    console.log('Save product:', data);
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      // TODO: Implement delete product functionality
      console.log('Delete product:', selectedProduct.id);
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
        } : undefined}
      />
    </Box>
  );
}
