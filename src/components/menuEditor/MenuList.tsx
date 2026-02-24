import { Box } from '@mui/material';
import { theme } from '../../theme';
import MenuListItem from './MenuListItem';
import type { MenuListItemViewModel } from '../../viewModels';

interface MenuListProps {
  menus: MenuListItemViewModel[];
  onMenuClick: (id: string) => void;
}

export default function MenuList({ menus, onMenuClick }: MenuListProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr',
          md: '1fr',
        },
        gap: theme.spacing.md,
      }}
    >
      {menus.map((menu) => (
        <MenuListItem
          key={menu.id}
          id={menu.id}
          name={menu.name}
          description={menu.description}
          isActive={menu.isActive}
          onClick={onMenuClick}
        />
      ))}
    </Box>
  );
}
