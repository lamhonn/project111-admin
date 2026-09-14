import { Box, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import type { Tablet } from '../../types/models';
import { useAtomValue, useSetAtom } from 'jotai';
import { getBillsBySessionIdAtom, getSessionBillsAtom, getTabletSessionAtom } from '../../state/sessionStore';
import { BillStatus } from '../../types/enums/billStatus';
import { useEffect } from 'react';
import { BillWebSocket } from '../../api/websocket/billSocket';

interface TableCardProps {
  table: Tablet;
  onClick: (table: Tablet) => void;
}

export default function TableCard({ table, onClick }: TableCardProps) {
  const { t } = useTranslation();

  const session = useAtomValue(getTabletSessionAtom(table.Id));
  const bills = useAtomValue(getSessionBillsAtom(session?.Id ?? ''));
  const hasNewBills = bills.some(bill => bill.TabletId === table.Id && bill.Status === BillStatus.REQUESTED);
  const getBills = useSetAtom(getBillsBySessionIdAtom);

  useEffect(() => {
    if (!session) return;
    getBills(session.Id);
    
    return BillWebSocket.subscribeToBillsCreated(session.UserId, () => getBills(session.Id));
  }, [session, getBills]);

  return (
    <Paper
      onClick={() => onClick(table)}
      sx={{
        position: 'relative',
        p: 3,
        // bgcolor: table.locked ? 'grey.700' : theme.colors.primary,
        bgcolor: theme.colors.primary,
        color: 'white',
        borderRadius: theme.borderRadius.medium,
        cursor: 'pointer',
        transition: theme.transitions.normal,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows.lg,
          // bgcolor: table.locked ? 'grey.800' : theme.colors.primaryHover,
          bgcolor: theme.colors.primaryHover,
        },
        height: 175,
        alignContent: 'center',
      }}
    >
      {hasNewBills && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            px: 1,
            py: 0.25,
            borderRadius: theme.borderRadius.small,
            bgcolor: '#ffecb3',
            color: '#5d4037',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: theme.typography.fontWeights.semibold }}>
            {t('common.bill')} {t('tableDialog.requested')}
          </Typography>
        </Box>
      )}

      {/* Table Number */}
      <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: theme.typography.fontWeights.semibold }}>
        {t('common.table')} {table.TableNumber}
      </Typography>
    </Paper>
  );
}
