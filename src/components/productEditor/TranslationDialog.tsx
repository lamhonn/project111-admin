import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { theme } from '../../theme/theme';
import { getTranslation } from "../../utils/multilingualNameUtils";

const SUPPORTED_LANGUAGES: Array<{ code: string; labelKey: string }> = [
  { code: 'fi', labelKey: 'admin.productEditor.dialog.languages.finnish' },
  { code: 'en', labelKey: 'admin.productEditor.dialog.languages.english' },
  { code: 'sv', labelKey: 'admin.productEditor.dialog.languages.swedish' },
] as const;

interface TranslationDialogProps {
  open: boolean,
  translations: string, // JSON string
  onSave: (translation: string) => void,
  onClose: () => void,
}

const TranslationDialog: React.FC<TranslationDialogProps> = ({
  open,
  onClose,
  onSave,
  translations,
}) => {
  const { t } = useTranslation();
  const [localTranslations, setLocalTranslations] = useState<string>(translations);

  useEffect(() => {
    setLocalTranslations(translations);
  }, [open])

  // It's a bit crude to do string<->JSON object conversions constantly, but this has proven the most consistent.
  // Might be worth optimizing at some point
  const handleTranslationValueChange = (key: string, value: string) => {
    if (!localTranslations) return;
   
    const translationObject = JSON.parse(localTranslations);

    const updatedTranslationObject = {
      ...translationObject,
      [key]: value
    }

    const translationString = JSON.stringify(updatedTranslationObject);

    setLocalTranslations(translationString);  
  }

  const handleSave = () => {
    onSave(localTranslations);
    onClose();
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
                value={getTranslation(localTranslations, language.code)}
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