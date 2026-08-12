import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';
import { MenuViewModel } from '../../types/viewModels/menuViewModel';

interface MenuSettingsDialogProps {
  open: boolean;
  name: string;
  enabled: boolean;
  weekdays: string[];
  onClose: () => void;
  onInputChange: (field: keyof MenuViewModel) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange: (field: keyof MenuViewModel) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleDay: (day: string) => void;
}

const MenuSettingsDialog: React.FC<MenuSettingsDialogProps> = ({
  open,
  name,
  enabled,
  weekdays,
  onClose,
  onInputChange,
  onSwitchChange,
  onToggleDay,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: theme.spacing.lg }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          <Typography
            variant="h6"
            fontWeight={theme.typography.fontWeights.semibold}
            sx={{ color: theme.colors.text }}
          >
            {t('admin.menuEditor.dialog.menuSettings')}
          </Typography>

          <TextField
            fullWidth
            label={t('admin.menuEditor.dialog.menuName')}
            placeholder={t('admin.menuEditor.dialog.menuNamePlaceholder')}
            value={name}
            onChange={onInputChange('Name')}
          />

          <FormControlLabel
            control={
              <Switch
                checked={enabled}
                onChange={onSwitchChange('Enabled')}
                color="primary"
              />
            }
            label={t('admin.menuEditor.dialog.activeStatus')}
          />

{/* TODO: pattern endtime, start time, and active days */}
          {/* <Box>
            <Typography variant="subtitle2" sx={{ color: theme.colors.text, mb: theme.spacing.xs }}>
              {t('admin.menuEditor.dialog.activePeriod')}
            </Typography>
            <Box sx={{ display: 'flex', gap: theme.spacing.md }}>
              <TextField
                fullWidth
                type="date"
                label={t('admin.menuEditor.dialog.activePeriodStart')}
                value={formData.EventStartTime || ''}
                onChange={onInputChange('EventStartTime')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="date"
                label={t('admin.menuEditor.dialog.activePeriodEnd')}
                value={formData.EventEndTime || ''}
                onChange={onInputChange('EventEndTime')}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
           */}
{/* 
          <Box>
            <Typography variant="subtitle2" sx={{ color: theme.colors.text, mb: theme.spacing.xs }}>
              {t('admin.menuEditor.dialog.automaticActiveDays')}
            </Typography>
            <Box sx={{ display: 'flex', gap: theme.spacing.xs, flexWrap: 'wrap' }}>
              {weekdays.map((day) => {
                const isSelected = (formData.activeDays || []).includes(day);

                return (
                  <Button
                    key={day}
                    size="small"
                    variant={isSelected ? 'contained' : 'outlined'}
                    onClick={() => onToggleDay(day)}
                    sx={{
                      minWidth: 52,
                      borderRadius: theme.borderRadius.large,
                      textTransform: 'none',
                    }}
                  >
                    {day}
                  </Button>
                );
              })}
            </Box>
          </Box> */}

          {/* <Box sx={{ display: 'flex', gap: theme.spacing.md }}>
            <TextField
              fullWidth
              type="time"
              label={t('admin.menuEditor.dialog.activeFrom')}
              value={formData.PatternStartTime || '11:00'}
              onChange={onInputChange('PatternStartTime')}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="time"
              label={t('admin.menuEditor.dialog.activeTo')}
              value={formData.PatternEndTime || '14:00'}
              onChange={onInputChange('PatternEndTime')}
              InputLabelProps={{ shrink: true }}
            />
          </Box> */}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: theme.spacing.lg, pb: theme.spacing.lg }}>
        <Button variant="contained" onClick={onClose} sx={{ textTransform: 'none' }}>
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuSettingsDialog;
