import { Box } from '@mui/material';
import { theme } from '../../theme';
import ProductEditorCard from './ProductEditorCard';

interface Product {
  id: number;
  name: string;
  description: string;
}

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ProductGrid({
  products,
  viewMode,
  onEdit,
  onDelete,
}: ProductGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: viewMode === 'grid' ? 'repeat(2, 1fr)' : '1fr',
          md: viewMode === 'grid' ? 'repeat(3, 1fr)' : '1fr',
        },
        gap: theme.spacing.lg,
      }}
    >
      {products.map((product) => (
        <ProductEditorCard
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          viewMode={viewMode}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
}
