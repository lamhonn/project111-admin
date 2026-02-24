import { Box } from '@mui/material';
import { theme } from '../../theme';
import ProductEditorCard from './ProductEditorCard';
import type { ProductListItemViewModel } from '../../viewModels';

interface ProductGridProps {
  products: ProductListItemViewModel[];
  onProductClick: (id: string) => void;
}

export default function ProductGrid({
  products,
  onProductClick,
}: ProductGridProps) {
  return (
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
      {products.map((product) => (
        <ProductEditorCard
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          onClick={onProductClick}
        />
      ))}
    </Box>
  );
}
