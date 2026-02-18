import { Box, Typography, Paper, Chip } from '@mui/material';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';

interface CampaignListItemProps {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  onClick: (id: number) => void;
}

export default function CampaignListItem({
  id,
  name,
  description,
  isActive,
  onClick,
}: CampaignListItemProps) {
  const { t } = useTranslation();

  return (
    <Paper
      onClick={() => onClick(id)}
      sx={{
        p: theme.spacing.lg,
        borderRadius: theme.borderRadius.small,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: 1,
        cursor: 'pointer',
        transition: theme.transitions.normal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
        '&:hover': {
          boxShadow: theme.shadows.primary,
          borderColor: theme.colors.primary,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          component="div"
          fontWeight={theme.typography.fontWeights.semibold}
          sx={{ mb: theme.spacing.xs }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {description}
        </Typography>
      </Box>
      <Chip
        label={isActive ? t('admin.campaignEditor.active') : t('admin.campaignEditor.inactive')}
        color={isActive ? 'success' : 'default'}
        size="small"
        sx={{
          borderRadius: theme.borderRadius.large,
          fontWeight: theme.typography.fontWeights.semibold,
        }}
      />
    </Paper>
  );
}
