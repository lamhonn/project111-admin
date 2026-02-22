import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';

interface SystemSettingsInputsProps {
  selectedLanguage: string;
  onLanguageChange: (value: string) => void;
}

export default function SystemSettingsInputs({ selectedLanguage, onLanguageChange }: SystemSettingsInputsProps) {
  const { t } = useTranslation();

  const handleLanguageChange = (event: { target: { value: string } }) => {
    onLanguageChange(event.target.value);
  };

  return (
    <Box sx={{ mb: theme.spacing.lg }}>
      <FormControl fullWidth variant="outlined">
        <InputLabel>{t('settings.systemLanguage')}</InputLabel>
        <Select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          label={t('settings.systemLanguage')}
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
        >
          <MenuItem value="en">{t('settings.languageEnglish')}</MenuItem>
          <MenuItem value="fi">{t('settings.languageFinnish')}</MenuItem>
          <MenuItem value="sv">{t('settings.languageSwedish')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
