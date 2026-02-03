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

const InProcessOrdersCard: React.FC<InProcessOrdersCardProps> = ({
  orders,
  inProcessOrderCount,
}) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ 
      bgcolor: 'background.paper',
      height: '100%', 
      borderRadius: theme.borderRadius.medium,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: 1,
    }}>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: theme.colors.text }}>
            {t('dashboard.orders.inProcess')}
          </Typography>
          <Typography variant="h3" sx={{ color: theme.colors.primary, fontWeight: theme.typography.fontWeights.bold }}>
            {String(inProcessOrderCount).padStart(2, '0')}
          </Typography>
        </Box>

        {orders.map((order) => (
          <Card
            key={order.id}
            sx={{
              bgcolor: theme.colors.background,
              mb: 2,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.medium,
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('dashboard.orders.orderNo', { number: order.orderNo })}
                  </Typography>
                  <Typography variant="body2" color="text.primary">{order.name}</Typography>
                </Box>
                <Chip
                  label={t(`dashboard.orders.status.${order.status}`)}
                  size="small"
                  sx={{
                    bgcolor: 'background.paper',
                    border: `1px solid ${getStatusColor(order.status)}`,
                    color: getStatusColor(order.status),
                    fontWeight: theme.typography.fontWeights.medium,
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
