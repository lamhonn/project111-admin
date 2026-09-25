import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import { errorAtom, selectedOrderAtom, updateOrderStatusAtom } from '../../state/orderStore';
import { orderOptionsDialogOpenAtom } from '../../state/orderStore';
import { OrderStatus } from '../../types/enums/orderStatus';
import { getTranslation } from '../../utils/multilingualNameUtils';


const OrderOptionsDialog: React.FC = () => {
  const { t, i18n } = useTranslation();
  const selectedOrder = useAtomValue(selectedOrderAtom);
  const setDialogOpen = useSetAtom(orderOptionsDialogOpenAtom);
  const updateOrderStatus = useSetAtom(updateOrderStatusAtom);
  const isOpen = useAtomValue(orderOptionsDialogOpenAtom);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const error = useAtomValue(errorAtom);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleConfirmOrder = async () => {
    if (!selectedOrder) return;

    try {
      updateOrderStatus(selectedOrder.id, OrderStatus.PREPARING);

      handleClose();
    } catch {
      setErrorMessage(error ?? 'Failed to update order status');
    }
  };

  const handleOrderReady = async () => {
    if (!selectedOrder) return;

    try {
      updateOrderStatus(selectedOrder.id, OrderStatus.COMPLETED);
      handleClose();
    } catch {
      setErrorMessage(error ?? 'Failed to update order status');
    }
  };

  if (!selectedOrder) {
    return null;
  }

  // Determine which action button to show based on status
  const renderActionButton = () => {
    switch (selectedOrder.orderStatus) {
      case OrderStatus.RECEIVED:
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
      case OrderStatus.PREPARING:
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
            {t('orderOptionsDialog.orderNumber', { number: selectedOrder.id })} • {t('orderOptionsDialog.table', { number: selectedOrder.tableNumber })}
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
        {selectedOrder.orderProducts.length === 0 ? (
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
            {selectedOrder.orderProducts.map((product) => {
              return (
                <Box
                  key={product.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    pb: theme.spacing.md,
                    borderBottom: `1px solid ${theme.colors.border}`,
                    '&:last-child': {
                      borderBottom: 'none',
                    },
                  }}
                >
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
                        {getTranslation(product.productName, i18n.language)}
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={theme.typography.fontWeights.bold}
                        sx={{ color: theme.colors.primary }}
                      >
                        {product.productPrice}€
                      </Typography>
                    </Box>
                    {/* TODO: quantity and comments */}
                    {/* <Typography
                      variant="body2"
                      sx={{ color: theme.colors.text, opacity: 0.6, mt: 0.5 }}
                    >
                      {product.price.toFixed(2)}
                    </Typography> */}
                    {/* {product.notes && (
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
                    )} */}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Total */}
        {selectedOrder.orderProducts.length > 0 && (
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
              {selectedOrder.totalPrice}€
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
    </>
  );
};

export default OrderOptionsDialog;
