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
  onProductClick: (id: number) => void;
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
