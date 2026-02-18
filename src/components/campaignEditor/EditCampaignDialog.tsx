import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';

interface CampaignData {
  campaignName?: string;
  description?: string;
  isActive?: boolean;
  [key: string]: any;
}

interface EditCampaignDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CampaignData) => void;
  onDelete?: () => void;
  initialData?: CampaignData;
}

const EditCampaignDialog: React.FC<EditCampaignDialogProps> = ({ 
  open, 
  onClose, 
  onSave, 
  onDelete,
  initialData = {} 
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CampaignData>({
    campaignName: initialData.campaignName || '',
    description: initialData.description || '',
    isActive: initialData.isActive || false,
    ...initialData
  });

  const handleInputChange = (field: keyof CampaignData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSwitchChange = (field: keyof CampaignData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.checked
    });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: theme.borderRadius.medium,
          boxShadow: theme.shadows.lg,
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: theme.colors.border,
          p: theme.spacing.lg,
        }}
      >
        <Typography 
          variant="h5" 
          component="div" 
          fontWeight={theme.typography.fontWeights.semibold}
        >
          {t('admin.campaignEditor.dialog.title')}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: theme.spacing.lg }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          {/* Campaign Name */}
          <TextField
            fullWidth
            label={t('admin.campaignEditor.dialog.campaignName')}
            placeholder={t('admin.campaignEditor.dialog.campaignNamePlaceholder')}
            value={formData.campaignName}
            onChange={handleInputChange('campaignName')}
            variant="outlined"
          />

          {/* Description */}
          <TextField
            fullWidth
            label={t('admin.campaignEditor.dialog.description')}
            multiline
            rows={4}
            placeholder={t('admin.campaignEditor.dialog.descriptionPlaceholder')}
            value={formData.description}
            onChange={handleInputChange('description')}
            variant="outlined"
          />

          {/* Active Status */}
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleSwitchChange('isActive')}
                color="primary"
              />
            }
            label={t('admin.campaignEditor.dialog.activeStatus')}
          />
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions 
        sx={{ 
          justifyContent: 'space-between',
          borderTop: '1px solid',
          borderColor: theme.colors.border,
          p: theme.spacing.lg,
        }}
      >
        <Box>
          {onDelete && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{
                borderRadius: theme.borderRadius.large,
                textTransform: 'none',
              }}
            >
              {t('admin.campaignEditor.dialog.delete')}
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: theme.spacing.sm }}>
          <Button 
            onClick={handleClose}
            sx={{
              borderRadius: theme.borderRadius.large,
              textTransform: 'none',
            }}
          >
            {t('admin.campaignEditor.dialog.cancel')}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{
              borderRadius: theme.borderRadius.large,
              textTransform: 'none',
              bgcolor: theme.colors.primary,
              '&:hover': {
                bgcolor: theme.colors.primaryHover,
              },
            }}
          >
            {t('admin.campaignEditor.dialog.save')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditCampaignDialog;
