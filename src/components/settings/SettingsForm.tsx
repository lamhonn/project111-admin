import { Box, Typography, Paper, Button, Divider } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';
import { useAtom, useSetAtom } from 'jotai';
import {
  settingsAtom,
  resetSettingsAtom,
  applySettingsAtom,
} from '../../context/settingsStore';
import OrganizationSettingsInputs from './OrganizationSettingsInputs';
import ColorSettingsInputs from './ColorSettingsInputs';
import CredentialsSettingsInputs from './CredentialsSettingsInputs';
import SystemSettingsInputs from './SystemSettingsInputs';

export default function SettingsForm() {
  const { t } = useTranslation();
  const [settings, setSettings] = useAtom(settingsAtom);
  const resetSettings = useSetAtom(resetSettingsAtom);
  const applySettings = useSetAtom(applySettingsAtom);

  const handlePasswordChangeWip = () => {
    console.log('WIP: password change flow not implemented yet');
  };

  const handleSave = () => {
    // Apply settings at atom level (including language change)
    applySettings();
  };

  const handleCancel = () => {
    // Reset all settings to defaults
    resetSettings();
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
          restaurantName={settings.restaurantName}
          onRestaurantNameChange={(value) =>
            setSettings((prev) => ({ ...prev, restaurantName: value }))
          }
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
      </Box>

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
          selectedLanguage={settings.systemLanguage}
          onLanguageChange={(value) =>
            setSettings((prev) => ({ ...prev, systemLanguage: value }))
          }
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
