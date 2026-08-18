import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { theme } from '../../theme/theme';
import { TranslationViewModel } from "../../types/viewModels/translationViewModel";

const SUPPORTED_LANGUAGES: Array<{ code: string; labelKey: string }> = [
  { code: 'fi', labelKey: 'admin.productEditor.dialog.languages.finnish' },
  { code: 'en', labelKey: 'admin.productEditor.dialog.languages.english' },
  { code: 'sv', labelKey: 'admin.productEditor.dialog.languages.swedish' },
] as const;

interface TranslationDialogProps {
  open: boolean,
  translations: TranslationViewModel,
  setTranslations: React.Dispatch<React.SetStateAction<TranslationViewModel>>
  onClose: () => void,
}

const TranslationDialog: React.FC<TranslationDialogProps> = ({
  open,
  onClose,
  translations,
  setTranslations,
}) => {
  const { t } = useTranslation();
  const [localTranslations, setLocalTranslations] = useState<TranslationViewModel>(translations);

  const handleTranslationValueChange = (key: string, value: string) => {
    setLocalTranslations((prev) => ({ ...prev, [key]: value }));
  }

  const handleSave = () => {
    setTranslations(localTranslations);
    onClose();
  }

  const getTranslation = (code: keyof TranslationViewModel): string | undefined => {
    const translation = localTranslations[code];
    return translation;
  }

  return (
  <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
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
          {`${t('admin.productEditor.dialog.addTranslation')}`}
        </Typography>
        <IconButton
          aria-label="close translation dialog"
          onClick={onClose}
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: theme.spacing.lg }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          {SUPPORTED_LANGUAGES.map((language) => (
            <Box key={language.code} sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
              <Typography variant="subtitle2" color="text.secondary" >
                {t(language.labelKey)}
              </Typography>
              <TextField
                fullWidth
                value={() => getTranslation(language.code as keyof TranslationViewModel)}
                onChange={(e) => handleTranslationValueChange(language.code, e.target.value)}
                // multiline={translationKey === 'Description' || translationKey === 'Ingredients'} // TODO: enable when we have verified UX
                // rows={translationKey === 'Description' ? 4 : translationKey === 'Ingredients' ? 3 : 1}
              />
            </Box>
          ))}
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
    </Dialog>
  );
}

export default TranslationDialog;