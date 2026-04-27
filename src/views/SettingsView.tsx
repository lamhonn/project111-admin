import { Box } from '@mui/material';
import { theme } from '../theme';
import SettingsHeader from '../components/settings/SettingsHeader';
import SettingsForm from '../components/settings/SettingsForm';

export default function SettingsView() {
  return (
    <Box sx={{ p: theme.spacing.lg, width: '100%', bgcolor: theme.colors.background, minHeight: '100vh' }}>
      <SettingsHeader />
      <SettingsForm />
    </Box>
  );
}
