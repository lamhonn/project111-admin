import { Box } from '@mui/material';
import { theme } from '../theme';
import { useState } from 'react';
import ProductEditorHeader from '../components/productEditor/ProductEditorHeader';
import ProductGrid from '../components/productEditor/ProductGrid';
import EditProductDialog from '../components/productEditor/EditProductDialog';

interface Product {
  id: number;
  name: string;
  description: string;
}

export default function ProductEditorView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Placeholder data - replace with actual data fetching
  const mockProducts = [1, 2, 3, 4, 5, 6].map((item) => ({
    id: item,
    name: `Product ${item}`,
    description: 'A delicious menu item made with fresh ingredients and carefully prepared to delight your customers. This product is a popular choice and comes highly recommended.',
  }));

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleProductClick = (id: number) => {
    const product = mockProducts.find(p => p.id === id);
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

      <ProductGrid
        products={mockProducts}
        onProductClick={handleProductClick}
      />

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
