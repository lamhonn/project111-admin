import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Bill } from '../../context/dashboardStore';
import { theme } from '../../theme/theme';

interface IncomingBillsCardProps {
  bills: Bill[];
  billCount: number;
}

const IncomingBillsCard: React.FC<IncomingBillsCardProps> = ({
  bills,
  billCount,
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
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              bgcolor: theme.colors.primaryLight,
              border: `2px solid ${theme.colors.primary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          <Box>
            <Typography variant="body2" color="text.secondary">
              {t('dashboard.bills.pending')}
            </Typography>
            <Typography variant="h3" sx={{ color: theme.colors.primary, fontWeight: theme.typography.fontWeights.bold }}>
              {billCount}
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          {t('dashboard.bills.title')}
        </Typography>

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {bills.map((bill) => (
            <Box
              key={bill.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                p: 1.5,
                bgcolor: 'grey.50',
                borderRadius: theme.borderRadius.medium,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: theme.borderRadius.xlarge,
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                {/* <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                  {t('common.table')}
                </Typography> */}
                <Typography variant="h6" sx={{ fontWeight: theme.typography.fontWeights.bold }}>
                  {bill.tableNumber}
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" fontWeight={theme.typography.fontWeights.medium}>
                  {bill.guestName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {bill.items} {t('dashboard.bills.items')} • €{bill.amount.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default IncomingBillsCard;
