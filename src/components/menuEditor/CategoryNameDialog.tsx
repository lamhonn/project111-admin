import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import TranslationDialog from '../productEditor/TranslationDialog';
import { languageAtom } from '../../state/uiStore';
import { useAtomValue } from 'jotai';
import { getTranslation } from '../../utils/multilingualNameUtils';

interface CategoryNameDialogProps {
  open: boolean;
  editingCategoryId: string | null;
  categoryNameInput: string;
  onClose: () => void;
  onSave: (translation?: string) => void;
  onOpenItemsDialog: () => void;
}

const CategoryNameDialog: React.FC<CategoryNameDialogProps> = ({
  open,
  editingCategoryId,
  categoryNameInput,
  onClose,
  onSave,
  onOpenItemsDialog,
}) => {
  const { t } = useTranslation();
  const language = useAtomValue(languageAtom);

  const [isTranslationDialogOpen, setIsTranslationDialogOpen] = useState(false);
  const [translations, setTranslations] = useState<string>(categoryNameInput);

  const handleTranslationDialogSave = (translation: string) => {
    setTranslations(translation);
  }

  const handleTranslationChange = (value: string) => {
    const jsonObject = JSON.parse(translations);
    jsonObject[language] = value;

    setTranslations(JSON.stringify(jsonObject));
  };

  const handleOpenTranslationDialog = () => {
    setIsTranslationDialogOpen(true);
  };

  const handleSave = () => {
    onSave(translations);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ p: theme.spacing.lg }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          <Typography
            variant="h6"
            fontWeight={theme.typography.fontWeights.semibold}
            sx={{ color: theme.colors.text }}
          >
            {editingCategoryId === null
              ? t('admin.menuEditor.dialog.addCategory')
              : t('admin.menuEditor.dialog.renameCategory')}
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label={t('admin.menuEditor.dialog.categoryName')}
            value={getTranslation(translations, language)}
            onChange={(e) => handleTranslationChange(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                  onClick={handleOpenTranslationDialog}
                >
                  <TranslateIcon />
                </IconButton>
              ),
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: theme.spacing.lg, pb: theme.spacing.lg }}>
        <Button
          variant="outlined"
          onClick={onOpenItemsDialog}
          sx={{ textTransform: 'none', mr: 'auto' }}
          disabled={editingCategoryId === null}
        >
          {t('admin.menuEditor.dialog.addRemoveItemsFromMenu')}
        </Button>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          {t('common.cancel')}
        </Button>
        <Button variant="contained" onClick={handleSave} sx={{ textTransform: 'none' }}>
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

export default CategoryNameDialog;
