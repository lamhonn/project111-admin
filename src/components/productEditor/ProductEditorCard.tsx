import { Box, Typography, Paper } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { theme } from '../../theme';
import { Product } from '../../types/models';
import { languageAtom } from '../../state/uiStore';
import { getTranslation } from '../../utils/multilingualNameUtils';

interface ProductEditorCardProps {
  product: Product;
  onClick: (product: Product) => void
}

export default function ProductEditorCard({
  product,
  onClick
}: ProductEditorCardProps) {
  const { name, description, imgUrl } = product;

  const language = useAtomValue(languageAtom);

  const handleClickProduct = () => {
    onClick(product);
  }

  return (
    <Paper
      onClick={handleClickProduct}
      sx={{
        p: theme.spacing.md,
        borderRadius: theme.borderRadius.small,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: 1,
        cursor: 'pointer',
        transition: theme.transitions.normal,
        '&:hover': {
          boxShadow: theme.shadows.primary,
          borderColor: theme.colors.primary,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection:'row', gap: theme.spacing.md }}>
        {/* Product Image */}
        <Box
          sx={{
            width: 120,
            height: 120,
            flexShrink: 0,
            bgcolor: 'grey.200',
            borderRadius: theme.borderRadius.small,
            mb: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={imgUrl || ''}
            alt={getTranslation(name, language)}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>

        {/* Content Section */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h6"
            component="div"
            fontWeight={theme.typography.fontWeights.semibold}
            sx={{ mb: theme.spacing.sm }}
          >
            {getTranslation(name, language)}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: theme.spacing.md,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {description ? getTranslation(description, language) : ''}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
