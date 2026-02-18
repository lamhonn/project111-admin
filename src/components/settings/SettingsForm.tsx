import { Box, Typography, Paper, Button, Divider } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { theme } from '../../theme';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrganizationSettingsInputs from './OrganizationSettingsInputs';
import ColorSettingsInputs from './ColorSettingsInputs';
import CredentialsSettingsInputs from './CredentialsSettingsInputs';

export default function SettingsForm() {
  const { t } = useTranslation();
  const [restaurantName, setRestaurantName] = useState('');
  const [accentColor, setAccentColor] = useState('#1976d2');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [dialogColor, setDialogColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [actionBarColor, setActionBarColor] = useState('#f5f5f5');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Save settings:', {
      restaurantName,
      accentColor,
      backgroundColor,
      dialogColor,
      textColor,
      actionBarColor,
      username,
      email,
      oldPassword,
      newPassword,
    });
  };

  const handleCancel = () => {
    // TODO: Implement cancel/reset functionality
    setRestaurantName('');
    setAccentColor('#1976d2');
    setBackgroundColor('#ffffff');
    setDialogColor('#ffffff');
    setTextColor('#000000');
    setActionBarColor('#f5f5f5');
    setUsername('');
    setEmail('');
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <Paper
      sx={{
        p: theme.spacing.lg,
        minWidth: '100%',
        borderRadius: theme.borderRadius.small,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: 1,
      }}
    >
      {/* Organization and Brand Settings Section */}
      <Typography
        variant="h6"
        component="div"
        fontWeight={theme.typography.fontWeights.semibold}
        sx={{ mb: theme.spacing.md }}
      >
        {t('settings.organizationAndBrand')}
      </Typography>

      {/* Organization Settings Subsection */}
      <Typography
        variant="subtitle1"
        component="div"
        fontWeight={theme.typography.fontWeights.medium}
        sx={{ mb: theme.spacing.md, color: 'text.secondary' }}
      >
        {t('settings.organizationSettings')}
      </Typography>
      <Box sx={{ mb: theme.spacing.lg }}>
        <OrganizationSettingsInputs
          restaurantName={restaurantName}
          onRestaurantNameChange={setRestaurantName}
        />
      </Box>

      {/* Color Settings Subsection */}
      <Typography
        variant="subtitle1"
        component="div"
        fontWeight={theme.typography.fontWeights.medium}
        sx={{ mb: theme.spacing.md, color: 'text.secondary' }}
      >
        {t('settings.colorSettings')}
      </Typography>
      <Box sx={{ mb: theme.spacing.xl }}>
        <ColorSettingsInputs
          accentColor={accentColor}
          onAccentColorChange={setAccentColor}
          backgroundColor={backgroundColor}
          onBackgroundColorChange={setBackgroundColor}
          dialogColor={dialogColor}
          onDialogColorChange={setDialogColor}
          textColor={textColor}
          onTextColorChange={setTextColor}
          actionBarColor={actionBarColor}
          onActionBarColorChange={setActionBarColor}
        />
      </Box>

      <Divider sx={{ mb: theme.spacing.xl }} />

      {/* Credentials Settings Section */}
      <Typography
        variant="h6"
        component="div"
        fontWeight={theme.typography.fontWeights.semibold}
        sx={{ mb: theme.spacing.md }}
      >
        {t('settings.credentials')}
      </Typography>

      <Box sx={{ mb: theme.spacing.xl }}>
        <CredentialsSettingsInputs
          username={username}
          onUsernameChange={setUsername}
          email={email}
          onEmailChange={setEmail}
          oldPassword={oldPassword}
          onOldPasswordChange={setOldPassword}
          newPassword={newPassword}
          onNewPasswordChange={setNewPassword}
        />
      </Box>

      <Divider sx={{ mb: theme.spacing.xl }} />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: theme.spacing.md, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            borderRadius: theme.borderRadius.large,
            textTransform: 'none',
            borderColor: theme.colors.border,
            color: 'text.primary',
            '&:hover': {
              borderColor: theme.colors.primary,
              backgroundColor: theme.colors.primaryLight,
            },
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{
            borderRadius: theme.borderRadius.large,
            textTransform: 'none',
            bgcolor: theme.colors.primary,
            '&:hover': {
              bgcolor: theme.colors.primaryHover,
            },
          }}
        >
          {t('settings.saveChanges')}
        </Button>
      </Box>
    </Paper>
  );
}
