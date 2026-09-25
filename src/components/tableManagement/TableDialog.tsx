import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import { Order, Tablet } from '../../types/models';
import { getSessionBillsAtom, getTabletSessionAtom, loadingAtom, updateSessionOrderStatusAtom } from '../../state/sessionStore';
import { useAtomValue, useSetAtom } from 'jotai';
import { OrderStatus } from '../../types/enums/orderStatus';
import { calculateTotalBillsPrice } from '../../utils/billUtils';
import { BillStatus } from '../../types/enums/billStatus';
import { getOrderStatusColor, getOrderStatusLabel } from '../../utils/orderUtils';
import { getTranslation } from '../../utils/multilingualNameUtils';
import { languageAtom } from '../../state/uiStore';
import TableActionsDialog from './TableActionsDialog';

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

interface TableDialogProps {
  isOpen: boolean;
  table: Tablet | null;
  onClose: () => void;
}

export default function TableDialog({
  isOpen,
  table,
  onClose,
}: TableDialogProps) {
  const { t } = useTranslation();
  const [actionsOpen, setActionsOpen] = useState(false);
  const language = useAtomValue(languageAtom);

  const loading = useAtomValue(loadingAtom);
  const updateSessionOrderStatus = useSetAtom(updateSessionOrderStatusAtom);

  const session = useAtomValue(getTabletSessionAtom(table?.id ?? ''));
  const bills = useAtomValue(getSessionBillsAtom(session?.id ?? ''));

  if (!table || !session) return null;

  const orderItems = session.orders.flatMap(order => order.orderProducts);
  const hasOrders = orderItems.length > 0;

  // Calculate payment summary including toppings
  const subtotal = calculateTotalBillsPrice(bills);
  const taxes = subtotal * 0.14; // 14% tax
  const beforeTaxes = subtotal - taxes;

// TODO: enable when table lock feature has been implemented
//  const handleToggleLockAction = () => {
//     if (!selectedTable) return;
//     setLockedTables(prev => {
//       const next = new Set(prev);
//       if (next.has(selectedTable.id)) {
//         next.delete(selectedTable.id);
//       } else {
//         next.add(selectedTable.id);
//       }
//       return next;
//     });
//     setSelectedTable(prev => prev ? { ...prev, locked: !prev.locked } : null);
//     handleDialogClose();
//   };

  const handleForceRefreshSessionOrders = () => {
    if (loading) {
      return;
    }

    // TODO: get session by ID
  };

  const runSessionOrderAction = async (
    orderNo: string,
    action: 'confirm' | 'ready'
  ) => {
    const orderStatus = action === 'confirm'
      ? OrderStatus.PREPARING
      : OrderStatus.COMPLETED;

    await updateSessionOrderStatus({
      sessionId: session.id,
      orderId: orderNo,
      orderStatus,
    });
  };

  const renderOrderAction = (order: Order) => {
    if (order.orderStatus === OrderStatus.RECEIVED) {
      return (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => void runSessionOrderAction(order.id, 'confirm')}
          disabled={loading}
          sx={{
            borderRadius: theme.borderRadius.medium,
            textTransform: 'none',
            fontWeight: theme.typography.fontWeights.semibold,
            px: 2.5,
          }}
        >
          {t('orderOptionsDialog.actions.confirm')}
        </Button>
      );
    }

    if (order.orderStatus === OrderStatus.PREPARING) {
      return (
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={() => void runSessionOrderAction(order.id, 'ready')}
          disabled={loading}
          sx={{
            borderRadius: theme.borderRadius.medium,
            textTransform: 'none',
            fontWeight: theme.typography.fontWeights.semibold,
            px: 2.5,
          }}
        >
          {t('orderOptionsDialog.actions.orderReady')}
        </Button>
      );
    }

    return null;
  };

  return (
    <>
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: theme.borderRadius.xlarge,
          maxHeight: '90vh',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={theme.typography.fontWeights.bold}>
            {t('common.table')} {table.tableNumber}
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

      {/* Order Items */}
      <DialogContent sx={{ p: theme.spacing.lg }}>
        {hasOrders ? (
          <>
            {/* Show bill splits if they exist */}
            {bills && (
              <>
                {/* Show all split bills */}
                {bills.map((bill, index) => {
                  if (bill.orderProducts.length === 0) return null;
                  const isRequested = bill.status === BillStatus.REQUESTED;

                  return (
                    <Box key={bill.id} sx={{ mb: theme.spacing.lg, opacity: isRequested ? 0.6 : 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: theme.spacing.md,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="body1"
                            fontWeight={theme.typography.fontWeights.semibold}
                            color={isRequested ? 'text.secondary' : 'text.primary'}
                          >
                            {t('tableDialog.bill')} {bill.id === EMPTY_GUID ? t('tableDialog.primaryBill') : bill.id}
                          </Typography>
                          {isRequested && (
                            <Chip
                              label={t('tableDialog.requested')}
                              size="small"
                              sx={{
                                backgroundColor: 'grey.400',
                                color: 'white',
                                fontWeight: theme.typography.fontWeights.semibold,
                                fontSize: '0.7rem',
                              }}
                            />
                          )}
                          <Chip
                            label={`${bill.orderProducts.length} ${
                              bill.orderProducts.length === 1
                                ? t('tableDialog.item')
                                : t('tableDialog.items')
                            }`}
                            size="small"
                            sx={{
                              bgcolor: isRequested
                                ? 'grey.200'
                                : theme.colors.primaryLight,
                              color: isRequested
                                ? 'text.secondary'
                                : theme.colors.primary,
                              fontWeight: theme.typography.fontWeights.medium,
                              fontSize: theme.typography.fontSizes.small,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body1"
                          fontWeight={theme.typography.fontWeights.bold}
                          color={isRequested ? 'text.secondary' : 'primary'}
                        >
                          {bill.totalPrice.toFixed(2)}€
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                        {bill.orderProducts.map((product) => {
                          return (
                            <Box
                              key={product.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: theme.spacing.sm,
                                pb: theme.spacing.md,
                                borderBottom: '1px solid #f3f4f6',
                                '&:last-child': {
                                  borderBottom: 'none',
                                },
                              }}
                            >
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="body1"
                                  fontWeight={theme.typography.fontWeights.semibold}
                                >
                                  {getTranslation(product.productName, language)}
                                </Typography>

                                {product.orderProductToppings && product.orderProductToppings.length > 0 && (
                                  <Box sx={{ mt: 0.5 }}>
                                    {product.orderProductToppings.map((topping) => (
                                      <Typography
                                        key={topping.id}
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: 'block', lineHeight: 1.4 }}
                                      >
                                        {getTranslation(topping.productTopping.name, language)} ({topping.productTopping.price.toFixed(2)}€)
                                      </Typography>
                                    ))}
                                  </Box>
                                )}

                                {product.orderProductExcludables && product.orderProductExcludables.length > 0 && (
                                  <Box sx={{ mt: 0.5 }}>
                                    {product.orderProductExcludables.map((excludable, index) => (
                                      <Typography
                                        key={index}
                                        variant="caption"
                                        sx={{
                                          display: 'block',
                                          lineHeight: 1.4,
                                          color: '#dc2626',
                                        }}
                                      >
                                        − {getTranslation(excludable.productExcludable.name, language)}
                                      </Typography>
                                    ))}
                                  </Box>
                                )}

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 0.5 }}
                                >
                                  {product.productPrice}€
                                </Typography>
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>

                      {index <
                        bills.filter((bill) => bill.orderProducts.length > 0).length - 1 && (
                        <Divider sx={{ mt: theme.spacing.lg }} />
                      )}
                    </Box>
                  );
                })}
              </>
            )}

            {/* Payment Summary */}
            <Box
              sx={{
                mt: theme.spacing.lg,
                pt: theme.spacing.lg,
                borderTop: `1px solid ${theme.colors.border}`,
              }}
            >
              <Typography
                variant="body1"
                fontWeight={theme.typography.fontWeights.semibold}
                sx={{ mb: theme.spacing.md }}
              >
                {t('tableDialog.paymentSummary')}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('tableDialog.priceBeforeVat')}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={theme.typography.fontWeights.medium}
                  >
                    €{beforeTaxes.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('tableDialog.vat')}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={theme.typography.fontWeights.medium}
                  >
                    {taxes.toFixed(2)}€
                  </Typography>
                </Box>
                <Divider sx={{ my: theme.spacing.sm }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    variant="body1"
                    fontWeight={theme.typography.fontWeights.semibold}
                  >
                    {t('common.total')}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={theme.typography.fontWeights.bold}
                    color="primary"
                  >
                    {subtotal.toFixed(2)}€
                  </Typography>
                </Box>
              </Box>
            </Box>
          </>
        ) : (
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
              {t('tableDialog.noOrders')}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            mt: hasOrders ? theme.spacing.xl : 0,
            pt: hasOrders ? theme.spacing.lg : 0,
            borderTop: hasOrders ? `1px solid ${theme.colors.border}` : 'none',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: theme.spacing.md,
            }}
          >
            <Typography
              variant="body1"
              fontWeight={theme.typography.fontWeights.semibold}
            >
              {t('orderOptionsDialog.title')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => void handleForceRefreshSessionOrders()}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={14} /> : <RefreshIcon fontSize="small" />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: theme.borderRadius.large,
                  }}
                >
                  {t('tableDialog.refresh')}
                </Button>
              {hasOrders && (
                <Chip
                  label={`${session.orders.length} ${session.orders.length === 1 ? t('tableDialog.item') : t('tableDialog.items')}`}
                  size="small"
                  sx={{
                    bgcolor: theme.colors.primaryLight,
                    color: theme.colors.primary,
                    fontWeight: theme.typography.fontWeights.medium,
                  }}
                />
              )}
            </Box>
          </Box>

          {loading ? (
            <CircularProgress size={16} />
          ) : hasOrders ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
              {session.orders.map((order) => {
                const statusChipStyles = getOrderStatusColor(order.orderStatus) ?? { backgroundColor: theme.colors.primaryLight, color: theme.colors.primary,};

                return (
                  <Box
                    key={order.id}
                    sx={{
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.large,
                      p: theme.spacing.lg,
                      backgroundColor: '#fff',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: theme.spacing.md,
                        mb: theme.spacing.md,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body1"
                          fontWeight={theme.typography.fontWeights.semibold}
                        >
                          {t('orderOptionsDialog.orderNumber', { number: order.id })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {t('orderOptionsDialog.table', { number: order.tableNumber })} • {order.created.toLocaleString()}
                        </Typography>
                      </Box>
                      <Chip
                        label={getOrderStatusLabel(order.orderStatus, t)}
                        size="small"
                        sx={{
                          backgroundColor: statusChipStyles.backgroundColor,
                          color: statusChipStyles.color,
                          fontWeight: theme.typography.fontWeights.semibold,
                        }}
                      />
                    </Box>

                    {order.orderProducts.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        {t('orderOptionsDialog.noProducts')}
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                        {order.orderProducts.map((product) => {
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
                              <Box sx={{ flex: 1 }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: theme.spacing.sm,
                                  }}
                                >
                                  <Typography
                                    variant="body1"
                                    fontWeight={theme.typography.fontWeights.semibold}
                                    sx={{ color: theme.colors.text }}
                                  >
                                    {getTranslation(product.productName, language)}
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    fontWeight={theme.typography.fontWeights.bold}
                                    sx={{ color: theme.colors.primary }}
                                  >
                                    {product.productPrice}€
                                  </Typography>
                                </Box>
                                {/* TODO: enable when notes are added */}
                                {/* {product.Notes && (
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

                    <Box
                      sx={{
                        mt: theme.spacing.md,
                        pt: theme.spacing.md,
                        borderTop: `1px solid ${theme.colors.border}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: theme.spacing.md,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          {t('orderOptionsDialog.total')}
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={theme.typography.fontWeights.bold}
                          sx={{ color: theme.colors.primary }}
                        >
                          {order.totalPrice}€
                        </Typography>
                      </Box>
                      {renderOrderAction(order)}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('tableDialog.noOrders')}
            </Typography>
          )}
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          p: theme.spacing.lg,
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <Button
          onClick={() => setActionsOpen(true)}
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: theme.colors.primary,
            color: 'white',
            fontWeight: theme.typography.fontWeights.semibold,
            textTransform: 'none',
            py: theme.spacing.md,
            borderRadius: theme.borderRadius.xlarge,
            '&:hover': {
              backgroundColor: theme.colors.primaryHover,
            },
          }}
        >
          {t('tableDialog.actions')}
        </Button>
      </DialogActions>

      <TableActionsDialog 
        isOpen={actionsOpen}
        onClose={() => setActionsOpen(false)}
        session={session}
      />
    </Dialog>
    </>
  );
}