import React, { useEffect, useState } from 'react';
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
import EditDietariesDialog from './EditDietariesDialog';
import EditToppingsDialog from './EditToppingsDialog';
import EditExcludablesDialog from './EditExcludablesDialog';
import StockPhotoDialog from './StockPhotoDialog'; 
import type { StockPhoto } from './StockPhotoDialog';
import { ProductDto } from '../../types/dtos/productDto';
import { useAtomValue, useSetAtom } from 'jotai';
import { languageAtom } from '../../state/uiStore';
import { organizationIdAtom } from '../../state/authStore';
import { Dietary, ProductExcludable, ProductTopping } from '../../types/models';
import { getTranslation } from '../../utils/multilingualNameUtils';
import TranslationDialog from './TranslationDialog';
import { createProductAtom, deleteProductAtom, errorAtom, getProductByIdAtom, loadingAtom, selectedProductIdAtom, updateProductAtom } from '../../state/productStore';
import { parsePriceValue } from '../../utils/productUtils';
import { TranslationViewModel } from '../../types/viewModels/translationViewModel';

interface EditProductDialogProps {
  open: boolean;
  onClose: () => void;
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({ 
  open, 
  onClose, 
}) => {
  const { t, i18n } = useTranslation();
  const language = useAtomValue(languageAtom);

  const loading = useAtomValue(loadingAtom);
  const error = useAtomValue(errorAtom);

  const organizationId = useAtomValue(organizationIdAtom);
  const createProduct = useSetAtom(createProductAtom);
  const updateProduct = useSetAtom(updateProductAtom);
  const deleteProduct = useSetAtom(deleteProductAtom);

  const selectedProductId = useAtomValue(selectedProductIdAtom);
  const selectedProduct = useAtomValue(getProductByIdAtom);
  
  const [formData, setFormData] = useState<ProductDto>(
    {
      Id: crypto.randomUUID(),
      Description: '{ "fi": "", "en": "", "sv": "" }',
      Name: '{ "fi": "", "en": "", "sv": "" }',
      Dietaries: [],
      FreeToppings: 0,
      ImgUrl: "",
      Ingredients: '{ "fi": "", "en": "", "sv": "" }',
      OrganizationId: organizationId ?? "",
      Price: 0,
      ProductExcludables: [],
      ProductToppings: []
    });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDietariesDialogOpen, setIsDietariesDialogOpen] = useState(false);
  const [isToppingsDialogOpen, setIsToppingsDialogOpen] = useState(false);
  const [isExcludablesDialogOpen, setIsExcludablesDialogOpen] = useState(false);
  const [isStockPhotoDialogOpen, setIsStockPhotoDialogOpen] = useState(false);
  const [isTranslationDialogOpen, setIsTranslationDialogOpen] = useState(false);
  const [editingTranslations, setEditingTranslations] = useState<TranslationViewModel>({ en: '', fi: '', sv: ''});
  
  useEffect(() => {
    if (selectedProduct) 
      setFormData({...selectedProduct});
  }, [selectedProduct]);

  const handleImageUpload = (imgUrl: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (imgUrl) {
      setFormData({
        ...formData,
        ImgUrl: imgUrl
      });
      
      // TODO: proper image upload logic
      // const reader = new FileReader();
      // reader.onloadend = () => {
      //   setImagePreview(reader.result as string);
      // };
      // reader.readAsDataURL(file);
    }
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parsePriceValue(event.target.value);

    setFormData((prev) => ({
      ...prev,
      Price: value,
    }));
  };

  const handleAddToppings = () => {
    setIsToppingsDialogOpen(true);
  };

  const handleAddExcludables = () => {
    setIsExcludablesDialogOpen(true);
  };

  const handleEditDietaries = () => {
    setIsDietariesDialogOpen(true);
  };

  const handleOpenStockPhotoDialog = () => {
    setIsStockPhotoDialogOpen(true);
  };

  const handleCloseStockPhotoDialog = () => {
    setIsStockPhotoDialogOpen(false);
  };

  const handleSaveStockPhoto = (photo: StockPhoto) => {
    setFormData((previous) => ({
      ...previous,
      ImgUrl: photo.link,
    }));
    setImagePreview(photo.link);
  };

  const handleCloseDietariesDialog = () => {
    setIsDietariesDialogOpen(false);
  };

  const handleCloseToppingsDialog = () => {
    setIsToppingsDialogOpen(false);
  };

  const handleCloseExcludablesDialog = () => {
    setIsExcludablesDialogOpen(false);
  };

  const handleOpenTranslationDialog = (field: keyof ProductDto) => {
    if ((field !== "Name" && field !== "Description" && field !== "Ingredients")) return;

    // FIXME: crashes. { fi: "", en: "", sv: "" } is not a proper JSON
    if (!formData[field]) return

    const translations = JSON.parse(formData[field]);
    setEditingTranslations(translations);
    setIsTranslationDialogOpen(true);
  };

  const handleCloseTranslationDialog = () => {
    setIsTranslationDialogOpen(false);
  };

  const handleTranslationValueChange = (field: keyof ProductDto, language: string, value: string) => {
    if (field !== "Name" && field !== "Description" && field !== "Ingredients") return;
      
    if (!formData[field]) return;
   
    const translationObject = JSON.parse(formData[field]);

    const updatedTranslationObject = {
      ...translationObject,
      [language]: value
    }

    setFormData((prev) => {
      
      const next: ProductDto = {
        ...prev,
        [field]: updatedTranslationObject,
      };

      return next;
    });
  };

  const handleToppingsChange = (toppings: ProductTopping[]) => {
    setFormData({
      ...formData,
      ProductToppings: toppings,
    });
  };

  const handleToppingsSettingsChange = (freeToppings: number) => {
    setFormData({
      ...formData,
      FreeToppings: freeToppings,
    });
  };

  const handleExcludablesChange = (excludables: ProductExcludable[]) => {
    setFormData({
      ...formData,
      ProductExcludables: excludables,
    });
  };

  const handleSaveDietaries = (dietaries: Dietary[]) => {
    setFormData({
      ...formData,
      Dietaries: dietaries
    });
  };

  const handleSave = () => {
    // if selectedProductId === '' => new product
    if (selectedProductId && selectedProduct) {
      updateProduct(formData);
    }
    else {
      createProduct(formData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (selectedProductId) {
      deleteProduct(selectedProductId);
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
          maxWidth: '95vw',
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

      <DialogContent sx={{ p: theme.spacing.lg }}>  
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
                  cursor: 'not-allowed',
                  bgcolor: 'background.default',
                  transition: theme.transitions.normal,
                  backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: 0.65,
                }}
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
                  onChange={(e) => handleImageUpload(e.target.value)}
                  disabled
                  style={{ display: 'none' }}
                />
              </Paper>

              <Typography 
                variant="caption" 
                color="primary" 
                sx={{ 
                  display: 'block', 
                  mt: theme.spacing.sm, 
                  cursor: 'not-allowed',
                  textAlign: 'center'
                }}
              >
                {t('admin.productEditor.dialog.moreGallery')}
              </Typography>

              <Button
                variant="outlined"
                fullWidth
                onClick={handleOpenStockPhotoDialog}
                sx={{
                  mt: theme.spacing.md,
                  textTransform: 'none',
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.medium,
                  fontWeight: theme.typography.fontWeights.medium,
                }}
              >
                Choose a stock photo instead
              </Button>
            </Box>
          </Box>

          {/* Right Column - Form Fields */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
              {/* Product Name */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('admin.productEditor.dialog.productName')}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => handleOpenTranslationDialog('Name')}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 999,
                    px: theme.spacing.md,
                    borderColor: theme.colors.border,
                    fontWeight: theme.typography.fontWeights.medium,
                  }}
                >
                  {t('admin.productEditor.dialog.addTranslation')}
                </Button>
              </Box>
              <TextField
                fullWidth
                placeholder={t('admin.productEditor.dialog.productNamePlaceholder')}
                value={getTranslation(formData.Name, language)}
                onChange={(e) => {handleTranslationValueChange('Name', language, e.target.value)}}
                variant="outlined"
              />

              {/* Price */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {/* {t('admin.productEditor.dialog.price')} */}
                  Price (€)
                </Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                inputProps={{ min: 0, step: '0.01' }}
                placeholder="0.00"
                value={formData.Price ?? 0}
                onChange={handlePriceChange}
                variant="outlined"
              />

              {/* Description */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('admin.productEditor.dialog.description')}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => handleOpenTranslationDialog('Description')}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 999,
                    px: theme.spacing.md,
                    borderColor: theme.colors.border,
                    fontWeight: theme.typography.fontWeights.medium,
                  }}
                >
                  {t('admin.productEditor.dialog.addTranslation')}
                </Button>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={6}
                placeholder={t('admin.productEditor.dialog.descriptionPlaceholder')}
                value={getTranslation(formData.Description ?? '', language)}
                onChange={(e) => handleTranslationValueChange('Description', language, e.target.value)}
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('admin.productEditor.dialog.ingredients')}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => handleOpenTranslationDialog('Ingredients')}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 999,
                    px: theme.spacing.md,
                    borderColor: theme.colors.border,
                    fontWeight: theme.typography.fontWeights.medium,
                  }}
                >
                  {t('admin.productEditor.dialog.addTranslation')}
                </Button>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder={t('admin.productEditor.dialog.ingredientsPlaceholder')}
                value={getTranslation(formData.Ingredients ?? '', language)}
                onChange={(e) => handleTranslationValueChange('Ingredients', language, e.target.value)}
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
                onClick={handleEditDietaries}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight={theme.typography.fontWeights.medium}>
                    {t('admin.productEditor.dialog.editDietaries')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {formData.Dietaries && formData.Dietaries.length > 0 ? (
                      <Chip
                        label={formData.Dietaries.join(', ')}
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      <Chip label={t('admin.productEditor.dialog.noneSelected')} size="small" variant="outlined" />
                    )}
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
          {selectedProductId && (
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

      <EditDietariesDialog
        open={isDietariesDialogOpen}
        onClose={handleCloseDietariesDialog}
        selectedDietaries={formData.Dietaries || []}
        onSave={handleSaveDietaries}
      />

      <EditToppingsDialog
        open={isToppingsDialogOpen}
        onClose={handleCloseToppingsDialog}
        toppings={formData.ProductToppings}
        onChange={handleToppingsChange}
        freeToppings={formData.FreeToppings ?? 0}
        onSettingsChange={handleToppingsSettingsChange}
      />

      <EditExcludablesDialog
        open={isExcludablesDialogOpen}
        onClose={handleCloseExcludablesDialog}
        excludables={formData.ProductExcludables}
        onChange={handleExcludablesChange}
      />

      <TranslationDialog 
        open={isTranslationDialogOpen}
        translations={editingTranslations}
        setTranslations={setEditingTranslations}
        onClose={handleCloseTranslationDialog}
      />

      <StockPhotoDialog
        open={isStockPhotoDialogOpen}
        onClose={handleCloseStockPhotoDialog}
        selectedPhotoLink={formData.ImgUrl ?? ''}
        onSave={handleSaveStockPhoto}
      />
    </Dialog>
  );
};

export default EditProductDialog;