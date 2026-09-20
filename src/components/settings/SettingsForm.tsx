import { Box, Typography, Paper, Button, Divider } from '@mui/material';
import { Save as SaveIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme';
import { useAtomValue, useSetAtom } from 'jotai';
import OrganizationSettingsInputs from './OrganizationSettingsInputs';
import ColorSettingsInputs from './ColorSettingsInputs';
import CredentialsSettingsInputs from './CredentialsSettingsInputs';
import SystemSettingsInputs from './SystemSettingsInputs';
import { logoutAtom } from '../../state/authStore';
import { useState } from 'react';
import { settingsAtom, updateSettingsAtom } from '../../state/uiStore';
import { SettingsViewModel } from '../../types/viewModels/settingsViewModel';

export default function SettingsForm() {
  const { t } = useTranslation();

  const settings = useAtomValue(settingsAtom);
  const updateSettings = useSetAtom(updateSettingsAtom);

  const [settingsInput, setSettingsInput] = useState<SettingsViewModel>(settings);

  const logout = useSetAtom(logoutAtom);

  const handlePasswordChangeWip = () => {
    console.log('WIP: password change flow not implemented yet');
  };

  const handleSave = () => {
    updateSettings(settingsInput);
  };

  const handleCancel = () => {
    setSettingsInput(settings);
  };

  const handleLogout = () => {
    logout();
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
          restaurantName={settings.OrganizationName}
          onRestaurantNameChange={(value) =>
            setSettingsInput((prev) => ({ ...prev, OrganizationName: value }))
          }
        />
      </Box>

{/* TODO: uncomment color settings when it actually affects the UI */}
      {/* Color Settings Subsection */}
      {/* <Typography
        variant="subtitle1"
        component="div"
        fontWeight={theme.typography.fontWeights.medium}
        sx={{ mb: theme.spacing.md, color: 'text.secondary' }}
      >
        {t('settings.colorSettings')}
      </Typography>
      <Box sx={{ mb: theme.spacing.xl }}>
        <ColorSettingsInputs
          accentColor={settings.accentColor}
          onAccentColorChange={(value) =>
            setSettings((prev) => ({ ...prev, accentColor: value }))
          }
          backgroundColor={settings.backgroundColor}
          onBackgroundColorChange={(value) =>
            setSettings((prev) => ({ ...prev, backgroundColor: value }))
          }
          dialogColor={settings.dialogColor}
          onDialogColorChange={(value) =>
            setSettings((prev) => ({ ...prev, dialogColor: value }))
          }
          textColor={settings.textColor}
          onTextColorChange={(value) =>
            setSettings((prev) => ({ ...prev, textColor: value }))
          }
          actionBarColor={settings.actionBarColor}
          onActionBarColorChange={(value) =>
            setSettings((prev) => ({ ...prev, actionBarColor: value }))
          }
        />
      </Box> */}

      <Divider sx={{ mb: theme.spacing.xl }} />

{/* TODO: uncomment when we have proper login update lifecycle */}
      {/* Credentials Settings Section */}
      {/* <Typography
        variant="h6"
        component="div"
        fontWeight={theme.typography.fontWeights.semibold}
        sx={{ mb: theme.spacing.md }}
      >
        {t('settings.credentials')}
      </Typography>

      <Box sx={{ mb: theme.spacing.xl }}>
        <CredentialsSettingsInputs
          username={settings.username}
          onUsernameChange={(value) =>
            setSettings((prev) => ({ ...prev, username: value }))
          }
          email={settings.email}
          onEmailChange={(value) =>
            setSettings((prev) => ({ ...prev, email: value }))
          }
          onPasswordChangeWip={handlePasswordChangeWip}
        />
      </Box> */}

      <Divider sx={{ mb: theme.spacing.xl }} />

      {/* System Settings Section */}
      <Typography
        variant="h6"
        component="div"
        fontWeight={theme.typography.fontWeights.semibold}
        sx={{ mb: theme.spacing.md }}
      >
        {t('settings.systemSettings')}
      </Typography>

      <Box sx={{ mb: theme.spacing.xl }}>
        <SystemSettingsInputs
          selectedLanguage={settings.Language}
          onLanguageChange={(value) =>
            setSettingsInput((prev) => ({ ...prev, Language: value }))
          }
        />
      </Box>

      <Divider sx={{ mb: theme.spacing.xl }} />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            borderRadius: theme.borderRadius.large,
            textTransform: 'none',
          }}
        >
          {t('settings.logout')}
        </Button>

        <Box sx={{ display: 'flex', gap: theme.spacing.md }}>
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
      </Box>
    </Paper>
  );
}
