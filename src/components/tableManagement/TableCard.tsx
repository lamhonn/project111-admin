import { Box, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import type { Table } from './types';

interface TableCardProps {
  table: Table;
  onClick: (table: Table) => void;
}

export default function TableCard({ table, onClick }: TableCardProps) {
  const { t } = useTranslation();

  return (
    <Paper
      onClick={() => onClick(table)}
      sx={{
        position: 'relative',
        p: 3,
        bgcolor: table.locked ? 'grey.700' : theme.colors.primary,
        color: 'white',
        borderRadius: theme.borderRadius.medium,
        cursor: 'pointer',
        transition: theme.transitions.normal,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows.lg,
          bgcolor: table.locked ? 'grey.800' : theme.colors.primaryHover,
        },
        height: 175,
        alignContent: 'center',
      }}
    >
      {table.billRequested && (
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
        {t('common.table')} {table.number}
      </Typography>
    </Paper>
  );
}
