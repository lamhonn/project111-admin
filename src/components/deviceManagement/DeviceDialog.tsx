import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Divider, TextField, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme';
import { useAtomValue, useSetAtom } from 'jotai';
import { deleteTabletAtom, editTabletAtom, selectedTabletAtom } from '../../state/tabletStore';
import { TabletViewModel } from '../../types/viewModels/tabletViewModel';

interface DeviceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeviceDialog({
  isOpen,
  onClose,
}: DeviceDialogProps) {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<TabletViewModel>();
  const tablet = useAtomValue(selectedTabletAtom);
  const updateTablet = useSetAtom(editTabletAtom);
  const deleteTablet = useSetAtom(deleteTabletAtom);

  const handleEditClick = () => {
    setEditMode(true);
    setEditedData(tablet);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedData(undefined);
  };

  const handleClose = () => {
    handleCancel();
    onClose();
  }

  const handleSave = async () => {
    if (!editedData) return;
    updateTablet(editedData);
    setEditMode(false);
    setEditedData(undefined);
  };

  const handleForgetClick = async () => {
    deleteTablet();
    onClose();
  };

  const handleFieldChange = (field: keyof TabletViewModel, value: string) => {
    setEditedData(prev => {
      if (!prev) return;
      return {
        ...prev,
        [field]: value
      }
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: theme.borderRadius.medium,
          bgcolor: theme.colors.background,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: theme.colors.primaryLight,
          fontWeight: theme.typography.fontWeights.bold,
          color: theme.colors.text,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{t('deviceManagement.deviceDetails')}</span>
        <IconButton
          onClick={handleClose}
          sx={{
            color: theme.colors.text,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Device ID */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: theme.colors.text,
                opacity: 0.7,
                fontWeight: theme.typography.fontWeights.semibold,
              }}
            >
              {t('deviceManagement.deviceId')}
            </Typography>
            {editMode ? (
              <TextField
                fullWidth
                size="small"
                disabled
                value={editedData?.Id || ''}
                onChange={(e) => handleFieldChange('Id', e.target.value)}
                sx={{
                  mt: 0.5,
                  '& .MuiOutlinedInput-root': {
                    color: theme.colors.text,
                    '& fieldset': {
                      borderColor: theme.colors.border,
                    },
                  },
                }}
              />
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: theme.colors.text,
                  mt: 0.5,
                }}
              >
                {tablet?.Id ?? t(`common.error`)}
              </Typography>
            )}
          </Box>

          <Divider sx={{ borderColor: theme.colors.border }} />

          {/* Table Number */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: theme.colors.text,
                opacity: 0.7,
                fontWeight: theme.typography.fontWeights.semibold,
              }}
            >
              {t('deviceManagement.tableNumber')}
            </Typography>
            {editMode ? (
              <TextField
                fullWidth
                size="small"
                value={editedData?.TableNumber || ''}
                onChange={(e) => handleFieldChange('TableNumber', e.target.value)}
                sx={{
                  mt: 0.5,
                  '& .MuiOutlinedInput-root': {
                    color: theme.colors.text,
                    '& fieldset': {
                      borderColor: theme.colors.border,
                    },
                  },
                }}
              />
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: theme.colors.text,
                  mt: 0.5,
                }}
              >
                {tablet?.TableNumber ?? t(`common.error`)}
              </Typography>
            )}
          </Box>

          {/* Last Seen */}
          <Box>
            {editMode ? (<></>) 
            : (
              <>
                <Divider sx={{ borderColor: theme.colors.border }} />

                <Typography
                  variant="caption"
                  sx={{
                    color: theme.colors.text,
                    opacity: 0.7,
                    fontWeight: theme.typography.fontWeights.semibold,
                  }}
                >
                  {t('deviceManagement.created')}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.colors.text,
                    mt: 0.5,
                  }}
                >
                  {tablet?.Created.toLocaleDateString() ?? t(`common.error`)}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          gap: 1,
          p: 2,
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        {editMode ? (
          <>
            <Button
              onClick={handleCancel}
              sx={{
                textTransform: 'none',
                color: theme.colors.text,
                '&:hover': {
                  bgcolor: theme.colors.primaryLight,
                },
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{
                textTransform: 'none',
                bgcolor: theme.colors.primary,
                '&:hover': {
                  bgcolor: theme.colors.primaryHover,
                },
              }}
            >
              {t('common.save')}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleEditClick}
              variant="contained"
              sx={{
                textTransform: 'none',
                bgcolor: theme.colors.primary,
                '&:hover': {
                  bgcolor: theme.colors.primaryHover,
                },
              }}
            >
              {t('deviceManagement.edit')}
            </Button>
            <Button
              onClick={handleForgetClick}
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderColor: theme.colors.border,
                color: theme.colors.text,
                '&:hover': {
                  bgcolor: 'rgba(255, 0, 0, 0.1)',
                  borderColor: theme.colors.border,
                },
              }}
            >
              {t('deviceManagement.forgetDevice')}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
