import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  Divider,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import TranslateIcon from '@mui/icons-material/Translate';

import { theme } from '../../theme/theme';
import { languageAtom } from '../../state/uiStore';
import { useAtomValue } from 'jotai';
import { ProductTopping } from '../../types/models';
import { parsePriceValue } from '../../utils/productUtils';
import { selectedProductIdAtom } from '../../state/productStore';
import { getTranslation } from '../../utils/multilingualNameUtils';
import TranslationDialog from './TranslationDialog';

interface EditToppingsDialogProps {
  open: boolean;
  onClose: () => void;
  toppings: ProductTopping[];
  onChange: (toppings: ProductTopping[]) => void;
  freeToppings: number;
  onSettingsChange: (freeToppings: number) => void;
}

const EditToppingsDialog: React.FC<EditToppingsDialogProps> = ({
  open,
  onClose,
  toppings,
  onChange,
  freeToppings,
  onSettingsChange,
}) => {
  const { t } = useTranslation();
  const [localToppings, setLocalToppings] = useState<ProductTopping[]>(toppings);
  const [isTranslationDialogOpen, setIsTranslationDialogOpen] = useState(false);
  const [translations, setTranslations] = useState<string>('{ "fi": "", "en": "", "sv": "" }');

  const language = useAtomValue(languageAtom);
  const selectedProductId = useAtomValue(selectedProductIdAtom);

  const [selectedToppingId, setSelectedToppingId] = useState<string>("");

  const handleTranslationDialogSave = (translation: string) => {
    if (!selectedToppingId) return;

    const next = localToppings.find(topping => topping.id === selectedToppingId);
    if (!next) return;

    const updatedToppings: ProductTopping[] = localToppings.map(prev => 
      prev.id === selectedToppingId
      ?
      {
        ...next, 
        name: translation
      } 
      : prev
    );

    setLocalToppings(updatedToppings);  
  }

  const handleToppingChange = (id: string, value: string) => {
    const next = localToppings.find(topping => topping.id === id);
    if (!next) return;

    const jsonObject = JSON.parse(next.name);
    jsonObject[language] = value;

    const updatedToppings: ProductTopping[] = localToppings.map(prev => 
      prev.id === id
      ?
      {
        ...next, 
        name: JSON.stringify(jsonObject)
      } 
      : prev
    );

    setLocalToppings(updatedToppings);
  };

  const handlePriceIncrementChange = (id: string, value: string) => {
    const next = localToppings.find(topping => topping.id === id);
    if (!next) return;

    const parsedValue = parsePriceValue(value);

    const updatedToppings: ProductTopping[] = localToppings.map(prev => 
      prev.id === id
      ?
      {
        ...next, 
        price: parsedValue
      } 
      : prev
    );

    setLocalToppings(updatedToppings)
  };

  const handleRemoveRow = (id: string) => {
    const next = localToppings.find(topping => topping.id === id);
    if (!next) return;

    const updatedToppings: ProductTopping[] = localToppings.filter(prev => prev.id !== id);
    
    setLocalToppings(updatedToppings);
  };

  const handleAddRow = () => {
    const newTopping: ProductTopping = {
      id: crypto.randomUUID(),
      name: '{ "fi": "", "en": "", "sv": "" }',
      productId: selectedProductId,
      price: 0,
      created: new Date(), // Will be updated in backend anyways
    }
    setLocalToppings([...localToppings, newTopping]);
  };

  const handleFreeToppingsChange = (value: string) => {
    const parsedValue = parsePriceValue(value);
    onSettingsChange(Number.isNaN(parsedValue) ? 0 : parsedValue);
  };

  // TODO: add when maxToppings are added
  // const handleMaxToppingsChange = (value: string) => {
  //   const parsedValue = Number.parseInt(value, 10);
  //   onSettingsChange({
  //     freeToppings,
  //     maxToppings: Number.isNaN(parsedValue) ? 0 : Math.max(0, parsedValue),
  //   });
  // };

  const handleOpenTranslationDialog = (translations: string, id: string) => {
    setSelectedToppingId(id);
    setTranslations(translations);
    setIsTranslationDialogOpen(true);
  };

  const handleSave = () => {
    onChange(localToppings);
    onClose();
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
            {/* TODO: uncomment when maxToppings has been added as a feature */}
            {/* <TextField
              type="number"
              label={t('admin.productEditor.dialog.maxToppings')}
              value={maxToppings}
              onChange={(e) => handleMaxToppingsChange(e.target.value)}
              inputProps={{ min: 0, step: 1 }}
              fullWidth
            /> */}
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
              {t('admin.productEditor.dialog.price')}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ width: 40, flexShrink: 0, textAlign: 'center' }}>
              {t('admin.productEditor.dialog.toppingRemoveHeader')}
            </Typography>
          </Box>

          {localToppings.map((topping, index) => (
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
                value={getTranslation(topping.name, language)}
                onChange={(e) => handleToppingChange(topping.id, e.target.value)}
                placeholder={t('admin.productEditor.dialog.addToppingPlaceholder')}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                      onClick={() => handleOpenTranslationDialog(topping.name, topping.id)}
                    >
                      <TranslateIcon />
                    </IconButton>
                  ),
                }}
              />
              <TextField
                type="number"
                value={topping.price}
                onChange={(e) => handlePriceIncrementChange(topping.id, e.target.value)}
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
                onClick={() => handleRemoveRow(topping.id)}
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

      <DialogActions
        sx={{
          px: theme.spacing.lg,
          py: theme.spacing.md,
          borderTop: '1px solid',
          borderColor: theme.colors.border,
          gap: theme.spacing.sm,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            px: theme.spacing.lg,
            borderRadius: theme.borderRadius.medium,
            borderColor: theme.colors.border,
            fontWeight: theme.typography.fontWeights.medium,
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            textTransform: 'none',
            px: theme.spacing.lg,
            borderRadius: theme.borderRadius.medium,
            bgcolor: theme.colors.primary,
            fontWeight: theme.typography.fontWeights.semibold,
            '&:hover': {
              bgcolor: theme.colors.primaryHover,
            },
          }}
        >
          {t('common.save')}
        </Button>
      </DialogActions>

      <TranslationDialog 
        open={isTranslationDialogOpen}
        translations={translations}
        onSave={handleTranslationDialogSave}
        onClose={() => {
          setIsTranslationDialogOpen(false)
        }}
      />
    </Dialog>
  );
};

export default EditToppingsDialog;