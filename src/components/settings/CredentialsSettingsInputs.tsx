import { Box, TextField } from '@mui/material';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';

interface CredentialsSettingsInputsProps {
  username: string;
  onUsernameChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  oldPassword: string;
  onOldPasswordChange: (value: string) => void;
  newPassword: string;
  onNewPasswordChange: (value: string) => void;
}

export default function CredentialsSettingsInputs({
  username,
  onUsernameChange,
  email,
  onEmailChange,
  oldPassword,
  onOldPasswordChange,
  newPassword,
  onNewPasswordChange,
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
      <TextField
        label={t('settings.oldPassword')}
        type="password"
        value={oldPassword}
        onChange={(e) => onOldPasswordChange(e.target.value)}
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
        label={t('settings.newPassword')}
        type="password"
        value={newPassword}
        onChange={(e) => onNewPasswordChange(e.target.value)}
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
