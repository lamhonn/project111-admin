import { Box, Typography, Paper, Button } from '@mui/material';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';

interface ProductEditorCardProps {
  id: number;
  name: string;
  description: string;
  viewMode: 'grid' | 'list';
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ProductEditorCard({
  id,
  name,
  description,
  viewMode,
  onEdit,
  onDelete,
}: ProductEditorCardProps) {
  const { t } = useTranslation();
  const isListMode = viewMode === 'list';

  return (
    <Paper
      sx={{
        p: theme.spacing.md,
        borderRadius: theme.borderRadius.small,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: 1,
        transition: theme.transitions.normal,
        '&:hover': {
          boxShadow: theme.shadows.primary,
          borderColor: theme.colors.primary,
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: isListMode ? 'row' : 'column', gap: isListMode ? theme.spacing.md : 0 }}>
        {/* Product Image */}
        <Box
          sx={{
            width: isListMode ? 120 : '100%',
            height: isListMode ? 120 : 200,
            flexShrink: 0,
            bgcolor: 'grey.200',
            borderRadius: theme.borderRadius.small,
            mb: isListMode ? 0 : theme.spacing.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ color: 'grey.500', fontSize: isListMode ? '0.75rem' : '1rem' }}>
            Product Image
          </Typography>
        </Box>

        {/* Content Section */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h6"
            component="div"
            fontWeight={theme.typography.fontWeights.semibold}
            sx={{ mb: theme.spacing.sm }}
          >
            {name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: theme.spacing.md,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: isListMode ? 2 : 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onEdit(id)}
              sx={{
                borderRadius: theme.borderRadius.large,
                textTransform: 'none',
                borderColor: theme.colors.border,
                color: 'text.primary',
                '&:hover': {
                  borderColor: theme.colors.primary,
                  backgroundColor: theme.colors.primaryLight,
                },
              }}
            >
              {t('admin.productEditor.edit')}
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => onDelete(id)}
              sx={{
                borderRadius: theme.borderRadius.large,
                textTransform: 'none',
              }}
            >
              {t('admin.productEditor.delete')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
