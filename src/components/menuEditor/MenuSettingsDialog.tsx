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
import type { MenuData } from './types';

interface MenuSettingsDialogProps {
  open: boolean;
  formData: MenuData;
  weekdays: string[];
  onClose: () => void;
  onInputChange: (field: keyof MenuData) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange: (field: keyof MenuData) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleDay: (day: string) => void;
}

const MenuSettingsDialog: React.FC<MenuSettingsDialogProps> = ({
  open,
  formData,
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
            value={formData.menuName}
            onChange={onInputChange('menuName')}
          />

          <TextField
            fullWidth
            label={t('admin.menuEditor.dialog.description')}
            multiline
            rows={3}
            placeholder={t('admin.menuEditor.dialog.descriptionPlaceholder')}
            value={formData.description}
            onChange={onInputChange('description')}
          />

          <FormControlLabel
            control={
              <Switch
                checked={Boolean(formData.isActive)}
                onChange={onSwitchChange('isActive')}
                color="primary"
              />
            }
            label={t('admin.menuEditor.dialog.activeStatus')}
          />

          <Box>
            <Typography variant="subtitle2" sx={{ color: theme.colors.text, mb: theme.spacing.xs }}>
              {t('admin.menuEditor.dialog.activePeriod')}
            </Typography>
            <Box sx={{ display: 'flex', gap: theme.spacing.md }}>
              <TextField
                fullWidth
                type="date"
                label={t('admin.menuEditor.dialog.activePeriodStart')}
                value={formData.activePeriodStart || ''}
                onChange={onInputChange('activePeriodStart')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="date"
                label={t('admin.menuEditor.dialog.activePeriodEnd')}
                value={formData.activePeriodEnd || ''}
                onChange={onInputChange('activePeriodEnd')}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>

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
          </Box>

          <Box sx={{ display: 'flex', gap: theme.spacing.md }}>
            <TextField
              fullWidth
              type="time"
              label={t('admin.menuEditor.dialog.activeFrom')}
              value={formData.activeFrom || '09:00'}
              onChange={onInputChange('activeFrom')}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="time"
              label={t('admin.menuEditor.dialog.activeTo')}
              value={formData.activeTo || '17:00'}
              onChange={onInputChange('activeTo')}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: theme.spacing.lg, pb: theme.spacing.lg }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          {t('common.cancel')}
        </Button>
        <Button variant="contained" onClick={onClose} sx={{ textTransform: 'none' }}>
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuSettingsDialog;
