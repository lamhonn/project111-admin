import React from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';

interface EditToppingsDialogProps {
  open: boolean;
  onClose: () => void;
  toppings: ToppingRow[];
  onChange: (toppings: ToppingRow[]) => void;
  freeToppings: number;
  maxToppings: number;
  onSettingsChange: (settings: { freeToppings: number; maxToppings: number }) => void;
}

export interface ToppingRow {
  name: string;
  priceIncrement: number;
}

const EditToppingsDialog: React.FC<EditToppingsDialogProps> = ({
  open,
  onClose,
  toppings,
  onChange,
  freeToppings,
  maxToppings,
  onSettingsChange,
}) => {
  const { t } = useTranslation();

  const handleToppingChange = (index: number, value: string) => {
    const nextToppings = [...toppings];
    nextToppings[index] = {
      ...nextToppings[index],
      name: value,
    };
    onChange(nextToppings);
  };

  const handlePriceIncrementChange = (index: number, value: string) => {
    const parsedValue = Number.parseFloat(value);
    const nextToppings = [...toppings];
    nextToppings[index] = {
      ...nextToppings[index],
      priceIncrement: Number.isNaN(parsedValue)
        ? 0
        : Math.max(0, Math.round(parsedValue * 100) / 100),
    };
    onChange(nextToppings);
  };

  const handleRemoveRow = (index: number) => {
    if (toppings.length === 1) {
      onChange([
        {
          ...toppings[0],
          name: '',
        },
      ]);
      return;
    }

    onChange(toppings.filter((_, rowIndex) => rowIndex !== index));
  };

  const handleAddRow = () => {
    onChange([
      ...toppings,
      {
        name: '',
        priceIncrement: 0,
      },
    ]);
  };

  const handleFreeToppingsChange = (value: string) => {
    const parsedValue = Number.parseInt(value, 10);
    onSettingsChange({
      freeToppings: Number.isNaN(parsedValue) ? 0 : Math.max(0, parsedValue),
      maxToppings,
    });
  };

  const handleMaxToppingsChange = (value: string) => {
    const parsedValue = Number.parseInt(value, 10);
    onSettingsChange({
      freeToppings,
      maxToppings: Number.isNaN(parsedValue) ? 0 : Math.max(0, parsedValue),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: theme.colors.border,
          p: theme.spacing.lg,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          fontWeight={theme.typography.fontWeights.semibold}
        >
          {t('admin.productEditor.dialog.addToppings')}
        </Typography>
        <IconButton aria-label="close toppings dialog" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: theme.spacing.lg }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
          <Box sx={{ display: 'flex', gap: theme.spacing.sm }}>
            <TextField
              type="number"
              label={t('admin.productEditor.dialog.freeToppings')}
              value={freeToppings}
              onChange={(event) => handleFreeToppingsChange(event.target.value)}
              inputProps={{ min: 0, step: 1 }}
              fullWidth
            />
            <TextField
              type="number"
              label={t('admin.productEditor.dialog.maxToppings')}
              value={maxToppings}
              onChange={(event) => handleMaxToppingsChange(event.target.value)}
              inputProps={{ min: 0, step: 1 }}
              fullWidth
            />
          </Box>

          <Divider sx={{ my: theme.spacing.sm }} />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
              {t('admin.productEditor.dialog.toppingNameHeader')}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ width: 120, flexShrink: 0 }}>
              {t('admin.productEditor.dialog.toppingPriceHeader')}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ width: 40, flexShrink: 0, textAlign: 'center' }}>
              {t('admin.productEditor.dialog.toppingRemoveHeader')}
            </Typography>
          </Box>

          {toppings.map((topping, index) => (
            <Box
              key={`topping-${index}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
              }}
            >
              <TextField
                fullWidth
                value={topping.name}
                onChange={(event) => handleToppingChange(index, event.target.value)}
                placeholder={t('admin.productEditor.dialog.addToppingPlaceholder')}
              />
              <TextField
                type="number"
                value={topping.priceIncrement}
                onChange={(event) => handlePriceIncrementChange(index, event.target.value)}
                placeholder={t('admin.productEditor.dialog.priceIncrement')}
                inputProps={{ min: 0, step: 0.01 }}
                sx={{
                  width: 120,
                  flexShrink: 0,
                  '& input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                }}
              />
              <IconButton
                aria-label={t('admin.productEditor.dialog.removeTopping')}
                onClick={() => handleRemoveRow(index)}
                sx={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  border: '1px solid',
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.medium,
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          <Box>
            <Button
              variant="outlined"
              onClick={handleAddRow}
              sx={{
                textTransform: 'none',
                borderRadius: 999,
                px: theme.spacing.md,
                borderColor: theme.colors.border,
                fontWeight: theme.typography.fontWeights.medium,
              }}
            >
              {t('admin.productEditor.dialog.addToppingButton')}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditToppingsDialog;