import { Box, Typography, TextField, IconButton, Tooltip, Button } from '@mui/material';
import { Add as AddIcon, ViewList, ViewModule } from '@mui/icons-material';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';

interface ProductEditorHeaderProps {
  onAddProduct: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ProductEditorHeader({
  onAddProduct,
  searchQuery,
  onSearchChange,
}: ProductEditorHeaderProps) {
  const { t } = useTranslation();

  return (
    <Box sx={{ 
      mb: theme.spacing.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      flexWrap: 'wrap',
    }}>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: theme.typography.fontWeights.bold,
        }}
      >
        {t('admin.productEditor.title')}
      </Typography>

      <Box sx={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
        <TextField
          placeholder={t('admin.productEditor.search')}
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            width: 300,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.colors.border,
              },
              '&:hover fieldset': {
                borderColor: theme.colors.primary,
              },
            },
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddProduct}
          sx={{
            borderRadius: theme.borderRadius.large,
            textTransform: 'none',
            bgcolor: theme.colors.primary,
            '&:hover': {
              bgcolor: theme.colors.primaryHover,
            },
          }}
        >
          {t('admin.productEditor.addProduct')}
        </Button>
      </Box>
    </Box>
  );
}
