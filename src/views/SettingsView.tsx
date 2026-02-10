import { Box, Typography, Paper, TextField, Button } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { theme } from '../theme';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function SettingsView() {
  const { t } = useTranslation();
  const [restaurantName, setRestaurantName] = useState('');

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Save settings:', { restaurantName });
  };

  const handleCancel = () => {
    // TODO: Implement cancel/reset functionality
    setRestaurantName('');
  };

  return (
    <Box sx={{ p: theme.spacing.lg, width: '100%', bgcolor: theme.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: theme.spacing.lg }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: theme.colors.brandWhite,
            fontWeight: theme.typography.fontWeights.bold,
          }}
        >
          {t('dashboard.menu.settings')}
        </Typography>
      </Box>

      {/* Settings Form */}
      <Paper
        sx={{
          p: theme.spacing.lg,
          minWidth: '100%',
          borderRadius: theme.borderRadius.small,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: 1,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          fontWeight={theme.typography.fontWeights.semibold}
          sx={{ mb: theme.spacing.lg }}
        >
          General Settings
        </Typography>

        <Box sx={{ mb: theme.spacing.lg }}>
          <TextField
            label="Restaurant Name"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
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
        </Box>

        <Box sx={{ display: 'flex', gap: theme.spacing.md, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
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
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{
              borderRadius: theme.borderRadius.large,
              textTransform: 'none',
              bgcolor: theme.colors.primary,
              '&:hover': {
                bgcolor: theme.colors.primaryHover,
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
