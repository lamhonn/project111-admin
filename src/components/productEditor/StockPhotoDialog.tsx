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
  { id: '4', link: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=1200' },
  { id: '5', link: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '6', link: 'https://images.unsplash.com/photo-1598023696416-0193a0bcd302?q=80&w=2736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },

  { id: '7', link: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200' },
  { id: '8', link: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200' },
  { id: '9', link: 'https://images.unsplash.com/photo-1713330801172-03f8d1c0dde7?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
  { id: '10', link: 'https://images.unsplash.com/photo-1703219342329-fce8488cf443?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
  { id: '11', link: 'https://images.unsplash.com/photo-1678110707493-8d05425137ac?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
  { id: '12', link: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },

  { id: '13', link: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJpZXN8ZW58MHx8MHx8fDA%3D'},
  { id: '14', link: 'https://images.unsplash.com/photo-1598679253544-2c97992403ea?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '15', link: 'https://images.unsplash.com/photo-1706711053549-f52f73a8960c?q=80&w=2675&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '16', link: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hpY2tlbiUyMG51Z2dldHN8ZW58MHx8MHx8fDA%3D' },
  { id: '17', link: 'https://images.unsplash.com/photo-1650939986300-ce9609921fa7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNoaWNrZW4lMjB3aW5nc3xlbnwwfHwwfHx8MA%3D%3D' },
  
  { id: '18', link: 'https://plus.unsplash.com/premium_photo-1661730329741-b3bf77019b39?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '19', link: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=3732&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},

  { id: '20', link: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=1200' },
  { id: '21', link: 'https://images.unsplash.com/photo-1725148029785-397acd3c1be3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzF8fGJlZXJ8ZW58MHx8MHx8fDA%3D' },
  { id: '22', link: 'https://images.unsplash.com/photo-1618183507099-4fa269f9b0ee?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGNvbGF8ZW58MHx8MHx8fDA%3D' },
  { id: '23', link: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '24', link: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=1200' },
];