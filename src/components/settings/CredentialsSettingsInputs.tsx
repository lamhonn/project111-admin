import { Box, TextField, Button } from '@mui/material';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';

interface CredentialsSettingsInputsProps {
  username: string;
  onUsernameChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  onPasswordChangeWip: () => void;
}

export default function CredentialsSettingsInputs({
  username,
  onUsernameChange,
  email,
  onEmailChange,
  onPasswordChangeWip,
}: CredentialsSettingsInputsProps) {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
      <TextField
        label={t('settings.username')}
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
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
      <TextField
        label={t('settings.email')}
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
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
      <Button
        variant="outlined"
        onClick={onPasswordChangeWip}
        sx={{
          alignSelf: 'flex-start',
          borderColor: theme.colors.border,
          color: 'text.primary',
          textTransform: 'none',
          '&:hover': {
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.primaryLight,
          },
        }}
      >
        {t('settings.changePasswordWip')}
      </Button>
    </Box>
  );
}
