import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import type { HistoryOrder } from '../../api/mockData/orderHistory.mock';

interface OrderHistoryDialogProps {
  open: boolean;
  order: HistoryOrder | null;
  onClose: () => void;
}

const OrderHistoryDialog: React.FC<OrderHistoryDialogProps> = ({ open, order, onClose }) => {
  const { t } = useTranslation();

  if (!order) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: theme.borderRadius.xlarge,
          maxHeight: '90vh',
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: theme.spacing.lg,
        borderBottom: `1px solid ${theme.colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <Box>
          <Typography 
            variant="h6"
            fontWeight={theme.typography.fontWeights.bold}
          >
            {t('orderHistory.dialog.title')}
          </Typography>
          <Typography 
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {order.orderNumber} • {order.date}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: theme.colors.text,
            '&:hover': {
              color: theme.colors.brandGrey,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Order Products */}
      <DialogContent sx={{ p: theme.spacing.lg }}>
        {order.products.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6,
              color: 'text.secondary',
            }}
          >
            <ReceiptLongIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
            <Typography variant="h6" color="text.secondary">
              {t('orderHistory.dialog.noProducts')}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
            {order.products.map((product) => {
              const itemTotalPrice = product.price * product.quantity;

              return (
                <Box
                  key={product.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: theme.spacing.sm,
                    pb: theme.spacing.md,
                    borderBottom: `1px solid ${theme.colors.border}`,
                    '&:last-child': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  {product.image && (
                    <Avatar
                      src={product.image}
                      alt={product.name}
                      variant="rounded"
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: theme.borderRadius.medium,
                      }}
                    />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}>
                      <Typography
                        variant="body1"
                        fontWeight={theme.typography.fontWeights.semibold}
                        sx={{ color: theme.colors.text }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={theme.typography.fontWeights.bold}
                        sx={{ color: theme.colors.primary }}
                      >
                        €{itemTotalPrice.toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.colors.text, opacity: 0.6, mt: 0.5 }}
                    >
                      {t('orderHistory.dialog.quantity')}: {product.quantity} × €{product.price.toFixed(2)}
                    </Typography>
                    {product.notes && (
                      <Typography
                        variant="caption"
                        sx={{ 
                          color: theme.colors.text, 
                          opacity: 0.7,
                          mt: 1,
                          display: 'block',
                          fontStyle: 'italic',
                        }}
                      >
                        {t('orderHistory.dialog.notes')}: {product.notes}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Total */}
        {order.products.length > 0 && (
          <Box
            sx={{
              mt: theme.spacing.lg,
              pt: theme.spacing.md,
              borderTop: `2px solid ${theme.colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h6"
              fontWeight={theme.typography.fontWeights.bold}
              sx={{ color: theme.colors.text }}
            >
              {t('orderHistory.dialog.total')}
            </Typography>
            <Typography
              variant="h6"
              fontWeight={theme.typography.fontWeights.bold}
              sx={{ color: theme.colors.primary }}
            >
              €{order.total.toFixed(2)}
            </Typography>
          </Box>
        )}
      </DialogContent>

      {/* Actions */}
      <Box sx={{ 
        p: theme.spacing.lg,
        borderTop: `1px solid ${theme.colors.border}`,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: theme.borderRadius.medium,
            textTransform: 'none',
            fontWeight: theme.typography.fontWeights.semibold,
            px: 4,
            py: 1.5,
          }}
        >
          {t('common.cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default OrderHistoryDialog;
