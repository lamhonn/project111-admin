import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Avatar,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import { useOrderActions } from '../../api/hooks/dashboard.hooks';
import { theme } from '../../theme/theme';
import type { Table, OrderItem } from './types';

interface TableDialogProps {
  open: boolean;
  table: Table | null;
  onClose: () => void;
  onDiscard?: () => void;
  onFinalize?: () => void;
  onToggleLock?: () => void;
  sessionOrders?: SessionOrderDetailsViewModel[];
  sessionOrdersLoading?: boolean;
  sessionOrdersError?: string;
  onRefreshSessionOrders?: () => Promise<void>;
  finalizing?: boolean;
  finalizeErrorMessage?: string | null;
  onFinalizeErrorClose?: () => void;
}

export default function TableDialog({
  open,
  table,
  onClose,
  onDiscard,
  onFinalize,
  onToggleLock,
  sessionOrders = [],
  sessionOrdersLoading = false,
  sessionOrdersError,
  onRefreshSessionOrders,
  finalizing = false,
  finalizeErrorMessage,
  onFinalizeErrorClose,
}: TableDialogProps) {
  const { t } = useTranslation();
  const { acceptOrder, markOrderReady } = useOrderActions();
  const [actionsOpen, setActionsOpen] = useState(false);

  if (!table) return null;

  const orderItems = table.orderItems ?? [];
  const hasSummaryOrders = orderItems.length > 0;
  const hasSessionOrders = sessionOrders.length > 0;

  const billSplitConfig = table.billSplitConfig;

  // Calculate new items that weren't in the original split
  const getNewItems = (): OrderItem[] => {
    if (!billSplitConfig) return [];

    const existingItemIds = new Set<string>();
    billSplitConfig.bills.forEach((bill) => {
      bill.items.forEach((item) => existingItemIds.add(item.id));
    });
    billSplitConfig.unsplitItems.forEach((item) => existingItemIds.add(item.id));

    return orderItems.filter((item) => !existingItemIds.has(item.id));
  };

  const newItems = getNewItems();
  const primaryBillItems = billSplitConfig
    ? [...billSplitConfig.unsplitItems, ...newItems]
    : [];

  // Helper function to calculate total for items
  const calculateItemsTotal = (items: OrderItem[]): number => {
    return items.reduce((sum, item) => {
      const itemBasePrice = item.price * item.quantity;
      const toppingsPrice = item.toppings
        ? item.toppings.reduce(
            (toppingSum, topping) =>
              toppingSum + topping.price * topping.quantity,
            0
          )
        : 0;
      return sum + itemBasePrice + toppingsPrice;
    }, 0);
  };

  // Calculate payment summary including toppings
  const subtotal = calculateItemsTotal(orderItems);
  const taxes = subtotal * 0.14; // 14% tax
  const beforeTaxes = subtotal - taxes;

  const getRuntimeStatusChipStyles = (status: RuntimeOrderStatus) => {
    switch (status) {
      case RuntimeOrderStatus.Preparing:
        return {
          backgroundColor: theme.colors.primaryLight,
          color: theme.colors.primary,
        };
      case RuntimeOrderStatus.Ready:
        return {
          backgroundColor: '#dcfce7',
          color: '#166534',
        };
      case RuntimeOrderStatus.Completed:
        return {
          backgroundColor: '#e5e7eb',
          color: '#4b5563',
        };
      case RuntimeOrderStatus.Cancelled:
        return {
          backgroundColor: '#fee2e2',
          color: '#991b1b',
        };
      case RuntimeOrderStatus.Pending:
      default:
        return {
          backgroundColor: '#fef3c7',
          color: '#92400e',
        };
    }
  };

  const handleDiscard = () => {
    if (onDiscard) {
      onDiscard();
    }
    onClose();
  };

  const handleToggleLockAction = () => {
    if (onToggleLock) {
      onToggleLock();
    }
    setActionsOpen(false);
  };

  const handleDiscardAction = () => {
    setActionsOpen(false);
    handleDiscard();
  };

  const handleFinalizeAction = () => {
    setActionsOpen(false);
    if (onFinalize) {
      void onFinalize();
    }
  };

  const handleForceRefreshSessionOrders = async () => {
    if (!onRefreshSessionOrders || refreshingOrders) {
      return;
    }

    try {
      setRefreshingOrders(true);
      // Debug-only manual force refresh to bypass polling wait.
      await onRefreshSessionOrders();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setRefreshingOrders(false);
    }
  };

  const runSessionOrderAction = async (
    orderNo: string,
    action: 'confirm' | 'ready'
  ) => {
    setActiveOrderMutationId(orderNo);

    try {
      const result = action === 'confirm'
        ? await acceptOrder(orderNo)
        : await markOrderReady(orderNo);

      if (!result.success) {
        setErrorMessage(
          result.error ??
            (action === 'confirm' ? 'Failed to confirm order' : 'Failed to mark order ready')
        );
        return;
      }

      if (onRefreshSessionOrders) {
        // Debug-only force refresh after order actions to surface updates immediately.
        await onRefreshSessionOrders();
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setActiveOrderMutationId(null);
    }
  };

  const renderSessionOrderAction = (order: SessionOrderDetailsViewModel) => {
    if (order.status === OrderItemStatus.New) {
      return (
        <Button
          variant="contained"
          color="primary"
          size="small"
          disabled={activeOrderMutationId === order.orderNo}
          onClick={() => void runSessionOrderAction(order.orderNo, 'confirm')}
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

    if (order.status === OrderItemStatus.Preparing) {
      return (
        <Button
          variant="contained"
          color="success"
          size="small"
          disabled={activeOrderMutationId === order.orderNo}
          onClick={() => void runSessionOrderAction(order.orderNo, 'ready')}
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
      open={open}
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
            {t('common.table')} {table.number}
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
        {!hasSummaryOrders && !hasSessionOrders && !sessionOrdersLoading && !sessionOrdersError ? (
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
        ) : hasSummaryOrders ? (
          <>
            {/* Show bill splits if they exist */}
            {billSplitConfig ? (
              <>
                {/* Show all split bills */}
                {billSplitConfig.bills.map((bill, index) => {
                  if (bill.items.length === 0) return null;
                  const isRequested = bill.status === 'requested';
                  const billTotal = calculateItemsTotal(bill.items);

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
                            {t('tableDialog.bill')} {bill.id}
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
                            label={`${bill.items.length} ${
                              bill.items.length === 1
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
                          €{billTotal.toFixed(2)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                        {bill.items.map((item) => {
                          const itemBasePrice = item.price * item.quantity;
                          const toppingsTotalPrice = item.toppings
                            ? item.toppings.reduce(
                                (sum, topping) =>
                                  sum + topping.price * topping.quantity,
                                0
                              )
                            : 0;
                          const itemTotalPrice = itemBasePrice + toppingsTotalPrice;

                          return (
                            <Box
                              key={item.id}
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
                              {item.image && (
                                <Avatar
                                  src={item.image}
                                  alt={item.name}
                                  variant="rounded"
                                  sx={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: theme.borderRadius.medium,
                                  }}
                                >
                                  {item.image}
                                </Avatar>
                              )}
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="body1"
                                  fontWeight={theme.typography.fontWeights.semibold}
                                >
                                  {item.quantity > 1 && `${item.quantity}x `}
                                  {item.name}
                                </Typography>

                                {item.toppings && item.toppings.length > 0 && (
                                  <Box sx={{ mt: 0.5 }}>
                                    {item.toppings.map((topping) => (
                                      <Typography
                                        key={topping.id}
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: 'block', lineHeight: 1.4 }}
                                      >
                                        + {topping.quantity > 1 && `${topping.quantity}x `}
                                        {topping.name} (€{topping.price.toFixed(2)})
                                      </Typography>
                                    ))}
                                  </Box>
                                )}

                                {item.excludables && item.excludables.length > 0 && (
                                  <Box sx={{ mt: 0.5 }}>
                                    {item.excludables.map((excludable, index) => (
                                      <Typography
                                        key={index}
                                        variant="caption"
                                        sx={{
                                          display: 'block',
                                          lineHeight: 1.4,
                                          color: '#dc2626',
                                        }}
                                      >
                                        − {excludable}
                                      </Typography>
                                    ))}
                                  </Box>
                                )}

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 0.5 }}
                                >
                                  €{itemTotalPrice.toFixed(2)}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>

                      {index <
                        billSplitConfig.bills.filter((b) => b.items.length > 0)
                          .length -
                          1 +
                          (primaryBillItems.length > 0 ? 1 : 0) && (
                        <Divider sx={{ mt: theme.spacing.lg }} />
                      )}
                    </Box>
                  );
                })}

                {/* Show unsplit items as "Primary Bill" */}
                {primaryBillItems.length > 0 && (
                  <Box>
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
                        >
                          {t('tableDialog.primaryBill')}
                        </Typography>
                        <Chip
                          label={`${primaryBillItems.length} ${
                            primaryBillItems.length === 1
                              ? t('tableDialog.item')
                              : t('tableDialog.items')
                          }`}
                          size="small"
                          sx={{
                            bgcolor: 'grey.100',
                            color: 'text.secondary',
                            fontWeight: theme.typography.fontWeights.medium,
                            fontSize: theme.typography.fontSizes.small,
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight={theme.typography.fontWeights.bold}
                        color="text.secondary"
                      >
                        €{calculateItemsTotal(primaryBillItems).toFixed(2)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                      {primaryBillItems.map((item) => {
                        const itemBasePrice = item.price * item.quantity;
                        const toppingsTotalPrice = item.toppings
                          ? item.toppings.reduce(
                              (sum, topping) =>
                                sum + topping.price * topping.quantity,
                              0
                            )
                          : 0;
                        const itemTotalPrice = itemBasePrice + toppingsTotalPrice;

                        return (
                          <Box
                            key={item.id}
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
                            {item.image && (
                              <Avatar
                                src={item.image}
                                alt={item.name}
                                variant="rounded"
                                sx={{
                                  width: 64,
                                  height: 64,
                                  borderRadius: theme.borderRadius.medium,
                                }}
                              >
                                {item.image}
                              </Avatar>
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="body1"
                                fontWeight={theme.typography.fontWeights.semibold}
                              >
                                {item.quantity > 1 && `${item.quantity}x `}
                                {item.name}
                              </Typography>

                              {item.toppings && item.toppings.length > 0 && (
                                <Box sx={{ mt: 0.5 }}>
                                  {item.toppings.map((topping) => (
                                    <Typography
                                      key={topping.id}
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ display: 'block', lineHeight: 1.4 }}
                                    >
                                      + {topping.quantity > 1 && `${topping.quantity}x `}
                                      {topping.name} (€{topping.price.toFixed(2)})
                                    </Typography>
                                  ))}
                                </Box>
                              )}

                              {item.excludables && item.excludables.length > 0 && (
                                <Box sx={{ mt: 0.5 }}>
                                  {item.excludables.map((excludable, index) => (
                                    <Typography
                                      key={index}
                                      variant="caption"
                                      sx={{
                                        display: 'block',
                                        lineHeight: 1.4,
                                        color: '#dc2626',
                                      }}
                                    >
                                      − {excludable}
                                    </Typography>
                                  ))}
                                </Box>
                              )}

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                €{itemTotalPrice.toFixed(2)}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              /* No split - show all items together */
              <>
                <Typography
                  variant="body1"
                  fontWeight={theme.typography.fontWeights.semibold}
                  sx={{ mb: theme.spacing.md }}
                >
                  {t('tableDialog.allItems')} ({orderItems.length})
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                  {orderItems.map((item) => {
                    const itemBasePrice = item.price * item.quantity;
                    const toppingsTotalPrice = item.toppings
                      ? item.toppings.reduce(
                          (sum, topping) => sum + topping.price * topping.quantity,
                          0
                        )
                      : 0;
                    const itemTotalPrice = itemBasePrice + toppingsTotalPrice;

                    return (
                      <Box
                        key={item.id}
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
                        {item.image && (
                          <Avatar
                            src={item.image}
                            alt={item.name}
                            variant="rounded"
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: theme.borderRadius.medium,
                            }}
                          >
                            {item.image}
                          </Avatar>
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body1"
                            fontWeight={theme.typography.fontWeights.semibold}
                          >
                            {item.quantity > 1 && `${item.quantity}x `}
                            {item.name}
                          </Typography>

                          {item.toppings && item.toppings.length > 0 && (
                            <Box sx={{ mt: 0.5 }}>
                              {item.toppings.map((topping) => (
                                <Typography
                                  key={topping.id}
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ display: 'block', lineHeight: 1.4 }}
                                >
                                  + {topping.quantity > 1 && `${topping.quantity}x `}
                                  {topping.name} (€{topping.price.toFixed(2)})
                                </Typography>
                              ))}
                            </Box>
                          )}

                          {item.excludables && item.excludables.length > 0 && (
                            <Box sx={{ mt: 0.5 }}>
                              {item.excludables.map((excludable, index) => (
                                <Typography
                                  key={index}
                                  variant="caption"
                                  sx={{
                                    display: 'block',
                                    lineHeight: 1.4,
                                    color: '#dc2626',
                                  }}
                                >
                                  − {excludable}
                                </Typography>
                              ))}
                            </Box>
                          )}

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            €{itemTotalPrice.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
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
                    €{taxes.toFixed(2)}
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
                    €{subtotal.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </>
        ) : null}

        <Box
          sx={{
            mt: hasSummaryOrders ? theme.spacing.xl : 0,
            pt: hasSummaryOrders ? theme.spacing.lg : 0,
            borderTop: hasSummaryOrders ? `1px solid ${theme.colors.border}` : 'none',
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
              {onRefreshSessionOrders && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => void handleForceRefreshSessionOrders()}
                  disabled={refreshingOrders}
                  startIcon={refreshingOrders ? <CircularProgress size={14} /> : <RefreshIcon fontSize="small" />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: theme.borderRadius.large,
                  }}
                >
                  Refresh
                </Button>
              )}
              {hasSessionOrders && (
                <Chip
                  label={`${sessionOrders.length} ${sessionOrders.length === 1 ? t('tableDialog.item') : t('tableDialog.items')}`}
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

          {sessionOrdersLoading ? (
            <Typography variant="body2" color="text.secondary">
              Loading order details...
            </Typography>
          ) : sessionOrdersError ? (
            <Typography variant="body2" color="error.main">
              {sessionOrdersError}
            </Typography>
          ) : hasSessionOrders ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
              {sessionOrders.map((order) => {
                const statusChipStyles = getRuntimeStatusChipStyles(order.runtimeStatus);

                return (
                  <Box
                    key={order.orderNo}
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
                          {t('orderOptionsDialog.orderNumber', { number: order.orderNo })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {t('orderOptionsDialog.table', { number: order.tableNumber })} • {order.time}
                        </Typography>
                      </Box>
                      <Chip
                        label={order.runtimeStatus}
                        size="small"
                        sx={{
                          backgroundColor: statusChipStyles.backgroundColor,
                          color: statusChipStyles.color,
                          fontWeight: theme.typography.fontWeights.semibold,
                        }}
                      />
                    </Box>

                    {order.products.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        {t('orderOptionsDialog.noProducts')}
                      </Typography>
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
                          {formatPriceWithEuro(order.total)}
                        </Typography>
                      </Box>
                      {renderSessionOrderAction(order)}
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

      <Dialog
        open={actionsOpen}
        onClose={() => setActionsOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: theme.borderRadius.large,
          },
        }}
      >
        <DialogContent sx={{ p: theme.spacing.lg }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
            <Button
              onClick={handleToggleLockAction}
              variant="outlined"
              fullWidth
              sx={{
                borderColor: table.locked ? 'grey.600' : theme.colors.primary,
                color: table.locked ? 'grey.700' : theme.colors.primary,
                fontWeight: theme.typography.fontWeights.semibold,
                textTransform: 'none',
                py: theme.spacing.md,
                borderRadius: theme.borderRadius.xlarge,
                '&:hover': {
                  borderColor: table.locked ? 'grey.800' : theme.colors.primaryHover,
                  backgroundColor: table.locked ? 'grey.100' : theme.colors.primaryLight,
                },
              }}
            >
              {table.locked ? t('tableDialog.unlockTable') : t('tableDialog.lockTable')}
            </Button>
            <Button
              onClick={handleDiscardAction}
              variant="outlined"
              fullWidth
              sx={{
                borderColor: theme.colors.primary,
                color: theme.colors.primary,
                fontWeight: theme.typography.fontWeights.semibold,
                textTransform: 'none',
                py: theme.spacing.md,
                borderRadius: theme.borderRadius.xlarge,
                '&:hover': {
                  borderColor: theme.colors.primaryHover,
                  backgroundColor: theme.colors.primaryLight,
                },
              }}
            >
              {t('tableDialog.discard')}
            </Button>
            <Button
              onClick={handleFinalizeAction}
              variant="contained"
              fullWidth
              disabled={orderItems.length === 0 && sessionOrders.length === 0 || finalizing}
              startIcon={finalizing ? <CircularProgress size={16} sx={{ color: 'white' }} /> : null}
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
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)',
                },
              }}
            >
              {t('tableDialog.finalize')}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Dialog>
    <ErrorReportDialog
      open={Boolean(errorMessage)}
      errorMessage={errorMessage ?? ''}
      onClose={() => setErrorMessage(null)}
    />
    <ErrorReportDialog
      open={Boolean(finalizeErrorMessage)}
      errorMessage={finalizeErrorMessage ?? ''}
      onClose={() => onFinalizeErrorClose?.()}
    />
    </>
  );
}
