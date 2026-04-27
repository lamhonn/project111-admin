import { Box, Typography, ToggleButton, ToggleButtonGroup, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme';

export type FilterPreset = 'today' | '3days' | 'week' | 'month' | 'custom';

interface OrderHistoryFiltersProps {
  filterPreset: FilterPreset;
  startDate: string;
  endDate: string;
  filteredOrdersCount: number;
  onPresetChange: (newPreset: FilterPreset) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function OrderHistoryFilters({
  filterPreset,
  startDate,
  endDate,
  filteredOrdersCount,
  onPresetChange,
  onStartDateChange,
  onEndDateChange,
}: OrderHistoryFiltersProps) {
  const { t } = useTranslation();

  const handlePresetChange = (_event: React.MouseEvent<HTMLElement>, newPreset: FilterPreset | null) => {
    if (newPreset !== null) {
      onPresetChange(newPreset);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Preset Filters */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: theme.colors.text,
            opacity: 0.7,
            fontWeight: theme.typography.fontWeights.medium,
          }}
        >
          {t('orderHistory.filters.showLast')}
        </Typography>
        <ToggleButtonGroup
          value={filterPreset}
          exclusive
          onChange={handlePresetChange}
          sx={{
            '& .MuiToggleButton-root': {
              px: 2,
              py: 0.75,
              textTransform: 'none',
              fontSize: '0.875rem',
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.text,
              '&.Mui-selected': {
                bgcolor: theme.colors.primary,
                color: theme.colors.brandWhite,
                '&:hover': {
                  bgcolor: theme.colors.primary,
                },
              },
              '&:hover': {
                bgcolor: theme.colors.primaryLight,
              },
            },
          }}
        >
          <ToggleButton value="today">{t('orderHistory.filters.today')}</ToggleButton>
          <ToggleButton value="3days">{t('orderHistory.filters.threeDays')}</ToggleButton>
          <ToggleButton value="week">{t('orderHistory.filters.week')}</ToggleButton>
          <ToggleButton value="month">{t('orderHistory.filters.month')}</ToggleButton>
          <ToggleButton value="custom">{t('orderHistory.filters.custom')}</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Custom Date Range */}
      {filterPreset === 'custom' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.colors.text,
              opacity: 0.7,
              fontWeight: theme.typography.fontWeights.medium,
            }}
          >
            {t('orderHistory.filters.showBetween')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              InputProps={{
                sx: {
                  bgcolor: theme.colors.background,
                  color: theme.colors.text,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.colors.border,
                  },
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Typography sx={{ color: theme.colors.text, opacity: 0.7 }}>{t('orderHistory.filters.to')}</Typography>
            <TextField
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              InputProps={{
                sx: {
                  bgcolor: theme.colors.background,
                  color: theme.colors.text,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.colors.border,
                  },
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </Box>
      )}

      {/* Results count */}
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'flex-end', height: '100%', pb: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.colors.text,
            opacity: 0.7,
          }}
        >
          {t('orderHistory.filters.showing', { count: filteredOrdersCount })}
        </Typography>
      </Box>
    </Box>
  );
}
