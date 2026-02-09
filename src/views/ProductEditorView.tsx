import { Box } from '@mui/material';
import { theme } from '../theme';
import { useState } from 'react';
import ProductEditorHeader from '../components/productEditor/ProductEditorHeader';
import ProductGrid from '../components/productEditor/ProductGrid';

export default function ProductEditorView() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data - replace with actual data fetching
  const mockProducts = [1, 2, 3, 4, 5, 6].map((item) => ({
    id: item,
    name: `Product ${item}`,
    description: 'Product description goes here',
  }));

  const handleAddProduct = () => {
    // TODO: Implement add product functionality
    console.log('Add product clicked');
  };

  const handleEditProduct = (id: number) => {
    // TODO: Implement edit product functionality
    console.log('Edit product:', id);
  };

  const handleDeleteProduct = (id: number) => {
    // TODO: Implement delete product functionality
    console.log('Delete product:', id);
  };

  return (
    <Box sx={{ p: theme.spacing.lg, width: '100%', bgcolor: theme.colors.background, minHeight: '100vh' }}>
      <ProductEditorHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddProduct={handleAddProduct}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ProductGrid
        products={mockProducts}
        viewMode={viewMode}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </Box>
  );
}
