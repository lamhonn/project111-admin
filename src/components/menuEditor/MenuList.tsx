import { Box } from '@mui/material';
import { theme } from '../../theme';
import MenuListItem from './MenuListItem';
import { Menu } from '../../types/models';
import { getTranslation } from '../../utils/multilingualNameUtils';
import { useTranslation } from 'react-i18next';
import { menusAtom } from '../../state/menuStore';
import { useAtomValue } from 'jotai';

interface MenuListProps {
  onMenuClick: (id: string) => void;
}

export default function MenuList({ onMenuClick }: MenuListProps) {
  const menus = useAtomValue(menusAtom);

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
          key={menu.Id}
          id={menu.Id}
          name={menu.Name}
          isActive={menu.Enabled}
          onClick={onMenuClick}
        />
      ))}
    </Box>
  );
}
