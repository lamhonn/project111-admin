import { Box, Typography } from '@mui/material';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';

export default function SettingsHeader() {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: theme.spacing.lg }}>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: theme.typography.fontWeights.bold,
        }}
      >
        {t('dashboard.menu.settings')}
      </Typography>
    </Box>
  );
}
