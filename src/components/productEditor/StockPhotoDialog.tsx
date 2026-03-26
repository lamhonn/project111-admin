import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';

export interface StockPhoto {
  id: string;
  link: string;
}

interface StockPhotoDialogProps {
  open: boolean;
  onClose: () => void;
  selectedPhotoLink?: string;
  onSave: (photo: StockPhoto) => void;
}

const StockPhotoDialog: React.FC<StockPhotoDialogProps> = ({
  open,
  onClose,
  selectedPhotoLink,
  onSave,
}) => {
  const { t } = useTranslation();
  const initialSelectedId = useMemo(() => {
    if (!selectedPhotoLink) {
      return STOCK_PHOTOS[0]?.id ?? '';
    }

    const selected = STOCK_PHOTOS.find((photo) => photo.link === selectedPhotoLink);
    return selected?.id ?? STOCK_PHOTOS[0]?.id ?? '';
  }, [selectedPhotoLink]);
  const [selectedId, setSelectedId] = useState(initialSelectedId);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedId(initialSelectedId);
  }, [open, initialSelectedId]);

  const selectedPhoto = STOCK_PHOTOS.find((photo) => photo.id === selectedId) ?? STOCK_PHOTOS[0];

  const handleSave = () => {
    if (!selectedPhoto) {
      return;
    }

    onSave(selectedPhoto);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
        <Typography variant="h6" component="div" fontWeight={theme.typography.fontWeights.semibold}>
          Choose a stock photo
        </Typography>
        <IconButton aria-label="close stock photo dialog" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: theme.spacing.lg }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: theme.spacing.lg,
          }}
        >
          <Box sx={{ flex: { xs: '1', md: '0 0 52%' } }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: theme.spacing.sm }}>
              Preview
            </Typography>
            <Card
              variant="outlined"
              sx={{
                borderRadius: theme.borderRadius.medium,
                overflow: 'hidden',
                borderColor: theme.colors.border,
              }}
            >
              <CardMedia
                component="img"
                image={selectedPhoto?.link}
                alt="Selected stock photo"
                sx={{
                  height: { xs: 220, md: 360 },
                  objectFit: 'cover',
                }}
              />
            </Card>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: theme.spacing.sm }}>
              Gallery
            </Typography>
            <Stack
              direction="row"
              useFlexGap
              flexWrap="wrap"
              spacing={theme.spacing.sm}
              sx={{
                maxHeight: { xs: 260, md: 360 },
                overflowY: 'auto',
                pr: theme.spacing.xs,
              }}
            >
              {STOCK_PHOTOS.map((photo) => {
                const isSelected = selectedId === photo.id;

                return (
                  <Card
                    key={photo.id}
                    variant="outlined"
                    sx={{
                      width: { xs: 'calc(50% - 8px)', md: 'calc(33.333% - 8px)' },
                      borderRadius: theme.borderRadius.medium,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      boxShadow: isSelected ? '0 0 0 1px rgba(0,0,0,0.04)' : 'none',
                    }}
                  >
                    <CardActionArea onClick={() => setSelectedId(photo.id)}>
                      <CardMedia
                        component="img"
                        image={photo.link}
                        alt={`Stock photo ${photo.id}`}
                        sx={{ height: 96, objectFit: 'cover' }}
                      />
                    </CardActionArea>
                  </Card>
                );
              })}
            </Stack>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: theme.spacing.lg,
          py: theme.spacing.md,
          borderTop: '1px solid',
          borderColor: theme.colors.border,
        }}
      >
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            textTransform: 'none',
            px: theme.spacing.lg,
            borderRadius: theme.borderRadius.medium,
            bgcolor: theme.colors.primary,
            fontWeight: theme.typography.fontWeights.semibold,
            '&:hover': {
              bgcolor: theme.colors.primaryHover,
            },
          }}
        >
          {t('common.save')}
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            px: theme.spacing.lg,
            borderRadius: theme.borderRadius.medium,
            borderColor: theme.colors.border,
            fontWeight: theme.typography.fontWeights.medium,
          }}
        >
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockPhotoDialog;

const STOCK_PHOTOS: StockPhoto[] = [
  { id: '1', link: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200' },
  { id: '2', link: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=1200' },
  { id: '3', link: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200' },
  { id: '4', link: 'https://images.unsplash.com/photo-1630384082554-e4e5c0e7b869?w=1200' },
  { id: '5', link: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=1200' },
  { id: '6', link: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=1200' },
  { id: '7', link: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200' },
  { id: '8', link: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=1200' },
];