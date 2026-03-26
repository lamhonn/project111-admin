import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import OrderList from '../components/dashboard/OrderList';
import { theme } from '../theme';
import { useAdminWebSocket } from '../api/hooks/dashboardWebSocket.hooks';

export default function OrderDashboardView() {
  const { t } = useTranslation();
  useAdminWebSocket();

  return (
    <Box sx={{ p: 3, width: '100%', bgcolor: theme.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
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
