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
  Paper,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme/theme';

interface ProductData {
  productName?: string;
  description?: string;
  ingredients?: string;
  productImage?: File | null;
  additionalImages?: File[];
  [key: string]: any;
}

interface EditProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProductData) => void;
  onDelete?: () => void;
  initialData?: ProductData;
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({ 
  open, 
  onClose, 
  onSave, 
  onDelete,
  initialData = {} 
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ProductData>({
    productName: initialData.productName || '',
    description: initialData.description || '',
    ingredients: initialData.ingredients || '',
    productImage: initialData.productImage || null,
    additionalImages: initialData.additionalImages || [],
    ...initialData
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (field: keyof ProductData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        productImage: file
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToppings = () => {
    // TODO: Implement toppings management
    console.log('Add/Remove Toppings clicked');
  };

  const handleAddExcludables = () => {
    // TODO: Implement excludables management
    console.log('Add/Remove Excludables clicked');
  };

  const handleEditAllergens = () => {
    // TODO: Implement allergen editor
    console.log('Edit Allergens clicked');
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
      maxWidth={false}
      PaperProps={{
        sx: {
          width: '95vw',
          height: '95vh',
          maxWidth: '95vw',
          maxHeight: '95vh',
          borderRadius: theme.borderRadius.medium,
          boxShadow: theme.shadows.lg,
          m: 0,
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
          {t('admin.productEditor.dialog.title')}
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

      <DialogContent sx={{ p: theme.spacing.lg, flex: 1, overflow: 'auto' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: theme.spacing.lg 
          }}
        >
          {/* Left Column - Image Upload */}
          <Box sx={{ flex: { xs: '1', md: '0 0 40%' } }}>
            <Box>
              <Typography 
                variant="subtitle2" 
                color="text.secondary" 
                gutterBottom
                sx={{ mb: theme.spacing.sm }}
              >
                {t('admin.productEditor.dialog.productImage')}
              </Typography>
              
              <Paper
                sx={{
                  height: { xs: 280, md: 450 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed',
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.medium,
                  cursor: 'pointer',
                  bgcolor: 'background.default',
                  transition: theme.transitions.normal,
                  '&:hover': {
                    borderColor: theme.colors.primary,
                    bgcolor: 'action.hover',
                  },
                  backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => document.getElementById('product-image-upload')?.click()}
              >
                {!imagePreview && (
                  <>
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {t('admin.productEditor.dialog.browseImage')}
                    </Typography>
                  </>
                )}
                <input
                  id="product-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </Paper>

              <Typography 
                variant="caption" 
                color="primary" 
                sx={{ 
                  display: 'block', 
                  mt: theme.spacing.sm, 
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onClick={() => document.getElementById('product-image-upload')?.click()}
              >
                {t('admin.productEditor.dialog.moreGallery')}
              </Typography>
            </Box>
          </Box>

          {/* Right Column - Form Fields */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
              {/* Product Name */}
              <TextField
                fullWidth
                label={t('admin.productEditor.dialog.productName')}
                placeholder={t('admin.productEditor.dialog.productNamePlaceholder')}
                value={formData.productName}
                onChange={handleInputChange('productName')}
                variant="outlined"
              />

              {/* Description */}
              <TextField
                fullWidth
                label={t('admin.productEditor.dialog.description')}
                multiline
                rows={6}
                placeholder={t('admin.productEditor.dialog.descriptionPlaceholder')}
                value={formData.description}
                onChange={handleInputChange('description')}
                variant="outlined"
              />

              {/* Action Buttons Row */}
              <Box sx={{ display: 'flex', gap: theme.spacing.md }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddToppings}
                  fullWidth
                  sx={{
                    borderColor: theme.colors.border,
                    color: 'text.primary',
                    textTransform: 'none',
                    fontWeight: theme.typography.fontWeights.medium,
                    borderRadius: theme.borderRadius.medium,
                    '&:hover': {
                      borderColor: theme.colors.primary,
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  {t('admin.productEditor.dialog.addToppings')}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddExcludables}
                  fullWidth
                  sx={{
                    borderColor: theme.colors.border,
                    color: 'text.primary',
                    textTransform: 'none',
                    fontWeight: theme.typography.fontWeights.medium,
                    borderRadius: theme.borderRadius.medium,
                    '&:hover': {
                      borderColor: theme.colors.primary,
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  {t('admin.productEditor.dialog.addExcludables')}
                </Button>
              </Box>

              {/* Ingredient Info */}
              <TextField
                fullWidth
                label={t('admin.productEditor.dialog.ingredients')}
                multiline
                rows={3}
                placeholder={t('admin.productEditor.dialog.ingredientsPlaceholder')}
                value={formData.ingredients}
                onChange={handleInputChange('ingredients')}
                variant="outlined"
              />

              {/* Edit Allergens */}
              <Paper
                sx={{
                  p: theme.spacing.md,
                  border: '1px solid',
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.medium,
                  cursor: 'pointer',
                  transition: theme.transitions.normal,
                  '&:hover': {
                    borderColor: theme.colors.primary,
                    bgcolor: 'action.hover'
                  }
                }}
                onClick={handleEditAllergens}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight={theme.typography.fontWeights.medium}>
                    {t('admin.productEditor.dialog.editAllergens')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    <Chip label={t('admin.productEditor.dialog.noneSelected')} size="small" variant="outlined" />
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: theme.spacing.lg,
          py: theme.spacing.md,
          borderTop: '1px solid',
          borderColor: theme.colors.border,
          gap: theme.spacing.sm,
          justifyContent: 'space-between'
        }}
      >
        <Box>
          {onDelete && (
            <Button 
              onClick={handleDelete}
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ 
                textTransform: 'none',
                px: theme.spacing.lg,
                borderRadius: theme.borderRadius.medium,
                fontWeight: theme.typography.fontWeights.medium,
              }}
            >
              {t('admin.productEditor.dialog.deleteProduct')}
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: theme.spacing.sm }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            sx={{ 
              textTransform: 'none',
              px: theme.spacing.lg,
              borderRadius: theme.borderRadius.medium,
              borderColor: theme.colors.border,
              fontWeight: theme.typography.fontWeights.medium,
            }}
          >
            {t('common.cancel')}
          </Button>
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
                bgcolor: theme.colors.primaryHover
              }
            }}
          >
            {t('admin.productEditor.dialog.saveProduct')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;