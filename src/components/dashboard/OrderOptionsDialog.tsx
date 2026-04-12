import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import { formatPriceWithEuro } from '../../utils/numberFormat';
import { useOrderActions } from '../../api/hooks/dashboard.hooks';
import ErrorReportDialog from '../common/ErrorReportDialog';
import {
  selectedOrderAtom,
  orderOptionsDialogOpenAtom,
  updateOrderStatusAtom,
  OrderItemStatus,
} from '../../context/dashboardStore';

const OrderOptionsDialog: React.FC = () => {
  const { t } = useTranslation();
  const selectedOrder = useAtomValue(selectedOrderAtom);
  const setDialogOpen = useSetAtom(orderOptionsDialogOpenAtom);
  const updateOrderStatus = useSetAtom(updateOrderStatusAtom);
  const { acceptOrder, markOrderReady } = useOrderActions();
  const isOpen = useAtomValue(orderOptionsDialogOpenAtom);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleConfirmOrder = async () => {
    if (!selectedOrder) return;

    try {
      const result = await acceptOrder(selectedOrder.orderNo);
      if (!result.success) {
        setErrorMessage(result.error ?? 'Failed to confirm order');
        return;
      }

      // Move order from "New" to "Preparing"
      updateOrderStatus({
        orderNo: selectedOrder.orderNo,
        newStatus: OrderItemStatus.Preparing,
      });

      handleClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    }
  };

  const handleOrderReady = async () => {
    if (!selectedOrder) return;

    try {
      const result = await markOrderReady(selectedOrder.orderNo);
      if (!result.success) {
        setErrorMessage(result.error ?? 'Failed to mark order ready');
        return;
      }

      // Move order from "Preparing" to "Ready" (removes from list)
      updateOrderStatus({
        orderNo: selectedOrder.orderNo,
        newStatus: OrderItemStatus.Ready,
      });

      handleClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    }
  };

  if (!selectedOrder) {
    return null;
  }

  // Determine which action button to show based on status
  const renderActionButton = () => {
    switch (selectedOrder.status) {
      case OrderItemStatus.New:
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmOrder}
            sx={{
              borderRadius: theme.borderRadius.medium,
              textTransform: 'none',
              fontWeight: theme.typography.fontWeights.semibold,
              px: 4,
              py: 1.5,
            }}
          >
            {t('orderOptionsDialog.actions.confirm')}
          </Button>
        );
      case OrderItemStatus.Preparing:
        return (
          <Button
            variant="contained"
            color="success"
            onClick={handleOrderReady}
            sx={{
              borderRadius: theme.borderRadius.medium,
              textTransform: 'none',
              fontWeight: theme.typography.fontWeights.semibold,
              px: 4,
              py: 1.5,
            }}
          >
            {t('orderOptionsDialog.actions.orderReady')}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <Dialog
      open={isOpen}
      onClose={handleClose}
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
            {t('orderOptionsDialog.title')}
          </Typography>
          <Typography 
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {t('orderOptionsDialog.orderNumber', { number: selectedOrder.orderNo })} • {t('orderOptionsDialog.table', { number: selectedOrder.tableNumber })}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
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
        {selectedOrder.products.length === 0 ? (
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
              {t('orderOptionsDialog.noProducts')}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
            {selectedOrder.products.map((product) => {
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
                        {formatPriceWithEuro(itemTotalPrice)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.colors.text, opacity: 0.6, mt: 0.5 }}
                    >
                      {t('orderOptionsDialog.quantity')}: {product.quantity} × {formatPriceWithEuro(product.price)}
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
                        {t('orderOptionsDialog.notes')}: {product.notes}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Total */}
        {selectedOrder.products.length > 0 && (
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
              {t('orderOptionsDialog.total')}
            </Typography>
            <Typography
              variant="h6"
              fontWeight={theme.typography.fontWeights.bold}
              sx={{ color: theme.colors.primary }}
            >
              {formatPriceWithEuro(selectedOrder.total)}
            </Typography>
          </Box>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ 
        p: theme.spacing.lg,
        borderTop: `1px solid ${theme.colors.border}`,
        justifyContent: 'space-between',
      }}>
        <Button
          onClick={handleClose}
          sx={{
            borderRadius: theme.borderRadius.medium,
            textTransform: 'none',
            color: theme.colors.text,
            fontWeight: theme.typography.fontWeights.medium,
          }}
        >
          {t('common.cancel')}
        </Button>
        {renderActionButton()}
      </DialogActions>
    </Dialog>
    <ErrorReportDialog
      open={Boolean(errorMessage)}
      errorMessage={errorMessage ?? ''}
      onClose={() => setErrorMessage(null)}
    />
    </>
  );
};

export default OrderOptionsDialog;
