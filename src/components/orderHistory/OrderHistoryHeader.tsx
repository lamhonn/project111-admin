import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme';

export default function OrderHistoryHeader() {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: theme.typography.fontWeights.bold,
          color: theme.colors.text,
          mb: 3,
        }}
      >
        {t('orderHistory.title')}
      </Typography>
    </Box>
  );
}
