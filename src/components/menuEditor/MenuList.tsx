import { Paper, List } from '@mui/material';
import { theme } from '../../theme';
import MenuListItem from './MenuListItem';

interface Menu {
  id: number;
  name: string;
  productCount: number;
}

interface MenuListProps {
  menus: Menu[];
  onMenuClick: (id: number) => void;
}

export default function MenuList({ menus, onMenuClick }: MenuListProps) {
  return (
    <Paper
      sx={{
        width: '100%',
        borderRadius: theme.borderRadius.small,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: 1,
        overflow: 'hidden',
      }}
    >
      <List sx={{ p: 0 }}>
        {menus.map((menu, index) => (
          <MenuListItem
            key={menu.id}
            id={menu.id}
            name={menu.name}
            productCount={menu.productCount}
            isLast={index === menus.length - 1}
            onClick={onMenuClick}
          />
        ))}
      </List>
    </Paper>
  );
}
