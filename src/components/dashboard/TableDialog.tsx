import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme';

interface Table {
  id: string;
  number: number;
  status: 'active' | 'inactive';
  progress: number;
  items: number;
  value: number;
  guestName?: string;
}

interface TableDialogProps {
  open: boolean;
  table: Table | null;
  onClose: () => void;
}

export default function TableDialog({ open, table, onClose }: TableDialogProps) {
  const { t } = useTranslation();

  if (!table) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: theme.borderRadius.medium,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: theme.typography.fontWeights.semibold }}>
        {t('common.table')} {table.number}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('tableDialog.tableId')}
            </Typography>
            <Typography variant="body2">{table.id}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('tableDialog.items')}
            </Typography>
            <Typography variant="body2">{table.items}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('tableDialog.totalValue')}
            </Typography>
            <Typography variant="body2">€{table.value.toFixed(2)}</Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: theme.colors.border,
            color: 'text.primary',
            textTransform: 'none',
            '&:hover': {
              borderColor: theme.colors.primary,
              backgroundColor: theme.colors.primaryLight,
            },
          }}
        >
          {t('common.close')}
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: theme.colors.primary,
            textTransform: 'none',
            '&:hover': {
              bgcolor: theme.colors.primaryHover,
            },
          }}
        >
          {t('tableDialog.editOrderButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
