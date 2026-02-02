import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { restaurantOpenAtom } from '../../context/dashboardStore';
import { theme } from '../../theme/theme';

interface DashboardHeaderProps {
  userName: string;
  date: string;
  lastLogin: string;
  avatarUrl?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  date,
  lastLogin,
  avatarUrl,
}) => {
  const { t } = useTranslation();
  const restaurantOpen = useAtomValue(restaurantOpenAtom);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
      <Box>
        <Typography variant="h6" sx={{ color: 'black' }}>
          {t('dashboard.welcome', { name: userName })}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <FiberManualRecord sx={{ color: restaurantOpen ? '#4CAF50' : '#ef4444', fontSize: 12 }} />
          <Typography sx={{ color: '#8e92bc', fontSize: '0.9rem' }}>
            {restaurantOpen ? t('dashboard.restaurantOpen') : t('dashboard.restaurantClosed')}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography sx={{ color: '#8e92bc', fontSize: '0.9rem' }}>
          {date}
        </Typography>
        <Typography sx={{ color: theme.colors.primary, fontSize: '0.9rem' }}>
          {t('dashboard.lastLogin', { time: lastLogin })}
        </Typography>
        <Avatar src={avatarUrl || '/api/placeholder/40/40'} sx={{ width: 40, height: 40 }} />
        <Typography sx={{ color: 'white' }}>{userName}</Typography>
      </Box>
    </Box>
  );
};

export default DashboardHeader;
