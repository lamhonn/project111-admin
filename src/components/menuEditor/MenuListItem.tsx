import { ListItem, ListItemText, Chip } from '@mui/material';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';

interface MenuListItemProps {
  id: number;
  name: string;
  productCount: number;
  isLast: boolean;
  onClick: (id: number) => void;
}

export default function MenuListItem({
  id,
  name,
  productCount,
  isLast,
  onClick,
}: MenuListItemProps) {
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
      <Chip
        label={`${productCount} ${t('admin.menuEditor.products')}`}
        sx={{
          bgcolor: theme.colors.primaryLight,
          color: theme.colors.primary,
          fontWeight: theme.typography.fontWeights.semibold,
          borderRadius: theme.borderRadius.large,
        }}
      />
    </ListItem>
  );
}
