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
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import TranslateIcon from '@mui/icons-material/Translate';
import { useAtomValue } from 'jotai';

import { theme } from '../../theme/theme';
import { ProductExcludable } from '../../types/models';
import TranslationDialog from './TranslationDialog';
import { languageAtom } from '../../state/uiStore';
import { selectedProductIdAtom } from '../../state/productStore';
import { getTranslation } from '../../utils/multilingualNameUtils';

interface EditExcludablesDialogProps {
  open: boolean;
  onClose: () => void;
  excludables: ProductExcludable[];
  onChange: (excludables: ProductExcludable[]) => void;
}

const EditExcludablesDialog: React.FC<EditExcludablesDialogProps> = ({
  open,
  onClose,
  excludables,
  onChange,
}) => {
  const { t } = useTranslation();
  const [localExcludables, setLocalExcludables] = useState<ProductExcludable[]>(excludables);
  const [isTranslationDialogOpen, setIsTranslationDialogOpen] = useState(false);
  const [translations, setTranslations] = useState<string>('{ "fi": "", "en": "", "sv": "" }');

  const language = useAtomValue(languageAtom);
  const selectedProductId = useAtomValue(selectedProductIdAtom);

  const [selectedExcludableId, setSelectedExcludableId] = useState<string>("");
  
  const handleTranslationDialogSave = (translation: string) => {
    if (!selectedExcludableId) return;

    const next = localExcludables.find(topping => topping.Id === selectedExcludableId);
    if (!next) return;

    const updatedExcludables: ProductExcludable[] = localExcludables.map(prev => 
      prev.Id === selectedExcludableId
      ?
      {
        ...next, 
        Name: translation
      } 
      : prev
    );

    setLocalExcludables(updatedExcludables);  
  }

  const handleExcludableChange = (id: string, value: string) => {
    const next = localExcludables.find(excludable => excludable.Id === id);
    if (!next) return;

    const jsonObject = JSON.parse(next.Name);
    jsonObject[language] = value;

    const updatedExcludables: ProductExcludable[] = localExcludables.map(prev => 
      prev.Id === id
      ?
      {
        ...next, 
        Name: JSON.stringify(jsonObject)
      } 
      : prev
    );

    setLocalExcludables(updatedExcludables);
  };

  const handleRemoveRow = (id: string) => {
    const next = localExcludables.find(excludable => excludable.Id === id);
    if (!next) return;

    const updatedExcludables: ProductExcludable[] = localExcludables.filter(prev => prev.Id !== id);
    
    setLocalExcludables(updatedExcludables);
  };

  const handleAddRow = () => {
    const newExcludable: ProductExcludable = {
      Id: crypto.randomUUID(),
      Name: JSON.stringify({ en: '', fi: '', sv: '' }),
      ProductId: selectedProductId,
      Created: new Date(), // Will be updated in backend anyways
    }
    setLocalExcludables([...localExcludables, newExcludable]);
  };

  const handleOpenTranslationDialog = (translations: string, id: string) => {
    setSelectedExcludableId(id);
    setTranslations(translations);
    setIsTranslationDialogOpen(true);
  };

  const handleSave = () => {
    onChange(localExcludables);
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
          {t('admin.productEditor.dialog.addExcludables')}
        </Typography>
        <IconButton aria-label="close excludables dialog" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: theme.spacing.lg }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
          {localExcludables.map((excludable, index) => (
            <Box
              key={`excludable-${index}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
              }}
            >
              <TextField
                fullWidth
                value={getTranslation(excludable.Name, language)}
                onChange={(e) => handleExcludableChange(excludable.Id, e.target.value)}
                placeholder={t('admin.productEditor.dialog.addExcludablePlaceholder')}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                      onClick={() => handleOpenTranslationDialog(excludable.Name, excludable.Id)}
                    >
                      <TranslateIcon />
                    </IconButton>
                  ),
                }}
              />
              <IconButton
                aria-label={t('admin.productEditor.dialog.removeExcludable')}
                onClick={() => handleRemoveRow(excludable.Id)}
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
              {t('admin.productEditor.dialog.addExcludableButton')}
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

export default EditExcludablesDialog;