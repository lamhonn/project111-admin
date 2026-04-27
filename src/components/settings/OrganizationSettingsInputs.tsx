import { Box, TextField } from '@mui/material';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';

interface OrganizationSettingsInputsProps {
  restaurantName: string;
  onRestaurantNameChange: (value: string) => void;
}

export default function OrganizationSettingsInputs({
  restaurantName,
  onRestaurantNameChange,
}: OrganizationSettingsInputsProps) {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: theme.spacing.lg }}>
      <TextField
        label={t('settings.restaurantName')}
        value={restaurantName}
        onChange={(e) => onRestaurantNameChange(e.target.value)}
        fullWidth
        variant="outlined"
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
