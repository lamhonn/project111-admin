import { ListItem, ListItemText, Chip, Box } from '@mui/material';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';

interface CampaignListItemProps {
  id: number;
  name: string;
  productCount: number;
  isActive: boolean;
  isLast: boolean;
  onClick: (id: number) => void;
}

export default function CampaignListItem({
  id,
  name,
  productCount,
  isActive,
  isLast,
  onClick,
}: CampaignListItemProps) {
  const { t } = useTranslation();

  return (
    <ListItem
      onClick={() => onClick(id)}
      sx={{
        borderBottom: !isLast ? `1px solid ${theme.colors.border}` : 'none',
        py: theme.spacing.md,
        px: theme.spacing.lg,
        transition: theme.transitions.normal,
        cursor: 'pointer',
        '&:hover': {
          bgcolor: theme.colors.primaryLight,
        },
      }}
    >
      <ListItemText
        primary={name}
        primaryTypographyProps={{
          variant: 'h6',
          fontWeight: theme.typography.fontWeights.semibold,
        }}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Chip
          label={`${productCount} ${t('admin.campaignEditor.products')}`}
          sx={{
            bgcolor: theme.colors.primaryLight,
            color: theme.colors.primary,
            fontWeight: theme.typography.fontWeights.semibold,
            borderRadius: theme.borderRadius.large,
          }}
        />
        <Chip
          label={isActive ? t('admin.campaignEditor.active') : t('admin.campaignEditor.inactive')}
          color={isActive ? 'success' : 'default'}
          size="small"
          sx={{
            borderRadius: theme.borderRadius.large,
            fontWeight: theme.typography.fontWeights.semibold,
          }}
        />
      </Box>
    </ListItem>
  );
}
