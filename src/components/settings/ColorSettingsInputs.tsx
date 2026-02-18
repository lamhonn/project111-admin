import { Box, TextField } from '@mui/material';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';

interface ColorSettingsInputsProps {
  accentColor: string;
  onAccentColorChange: (value: string) => void;
  backgroundColor: string;
  onBackgroundColorChange: (value: string) => void;
  dialogColor: string;
  onDialogColorChange: (value: string) => void;
  textColor: string;
  onTextColorChange: (value: string) => void;
  actionBarColor: string;
  onActionBarColorChange: (value: string) => void;
}

export default function ColorSettingsInputs({
  accentColor,
  onAccentColorChange,
  backgroundColor,
  onBackgroundColorChange,
  dialogColor,
  onDialogColorChange,
  textColor,
  onTextColorChange,
  actionBarColor,
  onActionBarColorChange,
}: ColorSettingsInputsProps) {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
      <TextField
        label={t('settings.accentColor')}
        type="color"
        value={accentColor}
        onChange={(e) => onAccentColorChange(e.target.value)}
        fullWidth
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.colors.border,
            },
            '&:hover fieldset': {
              borderColor: theme.colors.primary,
            },
          },
        }}
      />
      <TextField
        label={t('settings.backgroundColor')}
        type="color"
        value={backgroundColor}
        onChange={(e) => onBackgroundColorChange(e.target.value)}
        fullWidth
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.colors.border,
            },
            '&:hover fieldset': {
              borderColor: theme.colors.primary,
            },
          },
        }}
      />
      <TextField
        label={t('settings.dialogColor')}
        type="color"
        value={dialogColor}
        onChange={(e) => onDialogColorChange(e.target.value)}
        fullWidth
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.colors.border,
            },
            '&:hover fieldset': {
              borderColor: theme.colors.primary,
            },
          },
        }}
      />
      <TextField
        label={t('settings.textColor')}
        type="color"
        value={textColor}
        onChange={(e) => onTextColorChange(e.target.value)}
        fullWidth
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.colors.border,
            },
            '&:hover fieldset': {
              borderColor: theme.colors.primary,
            },
          },
        }}
      />
      <TextField
        label={t('settings.actionBarColor')}
        type="color"
        value={actionBarColor}
        onChange={(e) => onActionBarColorChange(e.target.value)}
        fullWidth
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.colors.border,
            },
            '&:hover fieldset': {
              borderColor: theme.colors.primary,
            },
          },
        }}
      />
    </Box>
  );
}
