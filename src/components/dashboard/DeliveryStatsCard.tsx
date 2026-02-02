import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { DeliveryStats, OrderStats } from '../../context/dashboardStore';
import { theme } from '../../theme/theme';

interface DeliveryStatsCardProps {
  deliveryStats: DeliveryStats;
  orderStats: OrderStats;
}

interface ChartDataPoint {
  day: string;
  value: number;
}

const DeliveryStatsCard: React.FC<DeliveryStatsCardProps> = ({
  deliveryStats,
  orderStats,
}) => {
  const { t } = useTranslation();

  const chartData: ChartDataPoint[] = [
    { day: t('dashboard.stats.today'), value: orderStats.today },
    { day: t('dashboard.stats.yesterday'), value: orderStats.yesterday },
    { day: t('dashboard.stats.lastMonth'), value: orderStats.lastMonth },
  ];

  const deliveryItems = [
    { 
      count: String(deliveryStats.delivered).padStart(2, '0'), 
      label: t('dashboard.delivery.delivered'), 
      color: '#8b5cf6' 
    },
    { 
      count: String(deliveryStats.onTheWay).padStart(2, '0'), 
      label: t('dashboard.delivery.onTheWay'), 
      color: '#8b5cf6' 
    },
    { 
      count: String(deliveryStats.cancelled).padStart(2, '0'), 
      label: t('dashboard.delivery.cancelled'), 
      color: '#8b5cf6' 
    },
  ];

  return (
    <Card sx={{ bgcolor: theme.colors.brandWhite, color: 'black', height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ mb: 3 }}>
          {t('dashboard.delivery.title')}
        </Typography>

        {deliveryItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              p: 2,
              bgcolor: theme.colors.primary,
              borderRadius: theme.borderRadius.medium,
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ color: item.color, fontWeight: theme.typography.fontWeights.bold }}>
                {item.count}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text }}>
                {item.label}
              </Typography>
            </Box>
            <Button variant="contained" size="small" sx={{ bgcolor: '#2a4a9f' }}>
              {t('dashboard.delivery.view')}
            </Button>
          </Box>
        ))}

        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            {t('dashboard.stats.title')}
          </Typography>
          {/* TODO: Install recharts library to enable chart: npm install recharts */}
          <Box sx={{ 
            height: 200, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: theme.colors.primary, 
            borderRadius: theme.borderRadius.medium 
          }}>
            <Typography variant="body2" sx={{ color: theme.colors.text }}>
              Chart: {chartData.map((d) => `${d.day}: ${d.value}`).join(' | ')}
            </Typography>
          </Box>
          {/* When recharts is installed, replace the Box above with:
          <ResponsiveContainer width="100%" height={200}>
            <RechartsBar data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2f5a" />
              <XAxis dataKey="day" stroke="#8e92bc" />
              <YAxis stroke="#8e92bc" />
              <Bar
                dataKey="value"
                fill="#8b5cf6"
                radius={[8, 8, 0, 0]}
                background={{ fill: '#1a1f45', radius: [8, 8, 0, 0] }}
              />
            </RechartsBar>
          </ResponsiveContainer>
          */}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DeliveryStatsCard;
