import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { InProcessOrder, OrderProcessStatus } from '../../context/dashboardStore';
import { theme } from '../../theme/theme';

interface InProcessOrdersCardProps {
  orders: InProcessOrder[];
  inProcessOrderCount: number;
}

// Helper function to get status color
const getStatusColor = (status: OrderProcessStatus): string => {
  switch (status) {
    case 'ready':
      return '#4CAF50';
    case 'prep':
      return '#FF9800';
    case 'cooking':
      return '#E91E63';
    default:
      return theme.colors.primary;
  }
};

// Helper function to get status background color
const getStatusBgColor = (status: OrderProcessStatus): string => {
  switch (status) {
    case 'ready':
      return '#1a3a36';
    case 'prep':
      return '#4a3520';
    case 'cooking':
      return '#3a1a26';
    default:
      return '#1a1f45';
  }
};

const InProcessOrdersCard: React.FC<InProcessOrdersCardProps> = ({
  orders,
  inProcessOrderCount,
}) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ bgcolor: theme.colors.brandWhite, color: 'black', height: '100%' }}>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: theme.colors.text }}>
            {t('dashboard.orders.inProcess')}
          </Typography>
          <Typography variant="h3" sx={{ color: '#8b5cf6', fontWeight: theme.typography.fontWeights.bold }}>
            {String(inProcessOrderCount).padStart(2, '0')}
          </Typography>
        </Box>

        {orders.map((order) => (
          <Card
            key={order.id}
            sx={{
              bgcolor: getStatusBgColor(order.status),
              color: 'white',
              mb: 2,
              border: `1px solid ${getStatusColor(order.status)}40`,
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#8e92bc' }}>
                    {t('dashboard.orders.orderNo', { number: order.orderNo })}
                  </Typography>
                  <Typography variant="body2">{order.name}</Typography>
                </Box>
                <Chip
                  label={t(`dashboard.orders.status.${order.status}`)}
                  size="small"
                  sx={{
                    bgcolor: getStatusColor(order.status),
                    color: 'white',
                    fontWeight: theme.typography.fontWeights.bold,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default InProcessOrdersCard;
