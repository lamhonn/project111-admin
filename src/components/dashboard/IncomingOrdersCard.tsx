import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { IncomingOrder } from '../../context/dashboardStore';
import { theme } from '../../theme/theme';

interface IncomingOrdersCardProps {
  orders: IncomingOrder[];
  activeOrderCount: number;
}

const IncomingOrdersCard: React.FC<IncomingOrdersCardProps> = ({
  orders,
  activeOrderCount,
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="body2" sx={{ color: theme.colors.text }}>
              {t('dashboard.orders.newActive')}
            </Typography>
            <Typography variant="h3" sx={{ color: theme.colors.primary, fontWeight: theme.typography.fontWeights.bold }}>
              {activeOrderCount}
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle2" sx={{ color: theme.colors.text, mb: 2 }}>
          {t('dashboard.orders.incoming')}
        </Typography>

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {orders.map((order) => (
            <Box
              key={order.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                p: 1,
                bgcolor: theme.colors.background,
                borderRadius: theme.borderRadius.medium,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: theme.borderRadius.medium,
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                {order.image}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2">{order.name}</Typography>
                <Typography variant="caption" sx={{ color: theme.colors.text }}>
                  {t('dashboard.orders.orderNo', { number: order.orderNo })}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default IncomingOrdersCard;
