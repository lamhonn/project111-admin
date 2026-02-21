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
} from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import type { Table, OrderItem } from './types';

interface TableDialogProps {
  open: boolean;
  table: Table | null;
  onClose: () => void;
  onDiscard?: () => void;
  onFinalize?: () => void;
  onToggleLock?: () => void;
}

export default function TableDialog({
  open,
  table,
  onClose,
  onDiscard,
  onFinalize,
  onToggleLock,
}: TableDialogProps) {
  const { t } = useTranslation();
  const [actionsOpen, setActionsOpen] = useState(false);

  if (!table) return null;

  // Mock order items if not provided
  const orderItems = table.orderItems || [
    {
      id: '1',
      productId: 'p1',
      name: 'Bread with Avocado',
      image: '🥑',
      price: 12.50,
      quantity: 1,
      toppings: [
        { id: 't1', name: 'Extra Cheese', price: 2.00, quantity: 1 },
      ],
    },
    {
      id: '2',
      productId: 'p2',
      name: 'Caesar Salad',
      image: '🥗',
      price: 15.00,
      quantity: 1,
      excludables: ['Croutons'],
    },
    {
      id: '3',
      productId: 'p3',
      name: 'Espresso',
      image: '☕',
      price: 4.50,
      quantity: 2,
    },
  ];

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

  const handleDiscard = () => {
    if (onDiscard) {
      onDiscard();
    }
    onClose();
  };

  const handleFinalize = () => {
    if (onFinalize) {
      onFinalize();
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
    handleFinalize();
  };

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
        {orderItems.length === 0 ? (
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
        ) : (
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
        )}
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
              disabled={orderItems.length === 0}
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
  );
}
