import { Box } from '@mui/material';
import { theme } from '../../theme';
import ProductEditorCard from './ProductEditorCard';
import { Product } from '../../types/models';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({
  products
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
          key={product.Id}
          product={product}
        />
      ))}
    </Box>
  );
}
