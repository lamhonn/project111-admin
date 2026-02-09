import { Box, Typography, Paper, Button } from '@mui/material';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';

interface ProductEditorCardProps {
  id: number;
  name: string;
  description: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ProductEditorCard({
  id,
  name,
  description,
  onEdit,
  onDelete,
}: ProductEditorCardProps) {
  const { t } = useTranslation();

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
      <Box
        sx={{
          height: 200,
          bgcolor: 'grey.200',
          borderRadius: theme.borderRadius.small,
          mb: theme.spacing.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ color: 'grey.500' }}>
          Product Image
        </Typography>
      </Box>
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
        sx={{ mb: theme.spacing.md }}
      >
        {description}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
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
    </Paper>
  );
}
