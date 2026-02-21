import { Paper, Typography } from '@mui/material';
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
      {/* Table Number */}
      <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: theme.typography.fontWeights.semibold }}>
        {t('common.table')} {table.number}
      </Typography>
    </Paper>
  );
}
