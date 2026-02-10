import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import OrderList from '../components/dashboard/OrderList';
import { theme } from '../theme';

export default function OrderDashboardView() {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3, width: '100%', bgcolor: theme.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: theme.typography.fontWeights.bold,
            color: theme.colors.text,
            mb: 1,
          }}
        >
          {t('dashboard.title')}
        </Typography>
      </Box>

      {/* New unified order list view */}
      <OrderList />
    </Box>
  );
}
