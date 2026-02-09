import { Box, Typography, TextField, IconButton, Tooltip, Button } from '@mui/material';
import { Add as AddIcon, ViewList, ViewModule } from '@mui/icons-material';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';

interface ProductEditorHeaderProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onAddProduct: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ProductEditorHeader({
  viewMode,
  onViewModeChange,
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
        variant="h4" 
        sx={{ 
          color: theme.colors.brandWhite,
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

        <Box sx={{ display: 'flex', border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.small }}>
          <Tooltip title="Grid View">
            <IconButton
              size="small"
              onClick={() => onViewModeChange('grid')}
              sx={{
                borderRadius: 0,
                color: viewMode === 'grid' ? theme.colors.primary : 'text.secondary',
                bgcolor: viewMode === 'grid' ? theme.colors.primaryLight : 'transparent',
              }}
            >
              <ViewModule />
            </IconButton>
          </Tooltip>
          <Tooltip title="List View">
            <IconButton
              size="small"
              onClick={() => onViewModeChange('list')}
              sx={{
                borderRadius: 0,
                color: viewMode === 'list' ? theme.colors.primary : 'text.secondary',
                bgcolor: viewMode === 'list' ? theme.colors.primaryLight : 'transparent',
              }}
            >
              <ViewList />
            </IconButton>
          </Tooltip>
        </Box>

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
