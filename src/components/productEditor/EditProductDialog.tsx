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
import EditAllergensDialog, { AllergenCode } from './EditAllergensDialog';
import EditToppingsDialog from './EditToppingsDialog';
import EditExcludablesDialog from './EditExcludablesDialog';
import StockPhotoDialog from './StockPhotoDialog.tsx';
import type { StockPhoto } from './StockPhotoDialog.tsx';
import type { ToppingRow } from './EditToppingsDialog';

type SupportedLanguage = 'fi' | 'en' | 'sv';
type TranslatableField = 'productName' | 'description' | 'ingredients';

type FieldTranslations = Record<SupportedLanguage, string>;
type ProductTranslations = Record<TranslatableField, FieldTranslations>;

const TRANSLATABLE_FIELDS: TranslatableField[] = ['productName', 'description', 'ingredients'];

const SUPPORTED_LANGUAGES: Array<{ code: SupportedLanguage; labelKey: string }> = [
  { code: 'fi', labelKey: 'admin.productEditor.dialog.languages.finnish' },
  { code: 'en', labelKey: 'admin.productEditor.dialog.languages.english' },
  { code: 'sv', labelKey: 'admin.productEditor.dialog.languages.swedish' },
];

interface ProductData {
  productName?: string;
  price?: number;
  description?: string;
  ingredients?: string;
  productTranslations?: ProductTranslations;
  productImage?: File | null;
  ImgUrl?: string;
  stockPhotoLink?: string;
  additionalImages?: File[];
  toppings?: ToppingRow[];
  excludables?: string[];
  freeToppings?: number;
  maxToppings?: number;
  allergens?: AllergenCode[];
  [key: string]: any;
}

const createDefaultToppingRow = (): ToppingRow => ({
  name: '',
  priceIncrement: 0,
});

const normalizeToppings = (toppings: unknown): ToppingRow[] => {
  if (!Array.isArray(toppings) || toppings.length === 0) {
    return [createDefaultToppingRow()];
  }

  if (typeof toppings[0] === 'string') {
    return (toppings as string[]).map((name) => ({
      name,
      priceIncrement: 0,
    }));
  }

  return (toppings as Array<Partial<ToppingRow>>).map((row) => ({
    name: row.name ?? '',
    priceIncrement: row.priceIncrement ?? 0,
  }));
};

const normalizeExcludables = (excludables: unknown): string[] => {
  if (!Array.isArray(excludables) || excludables.length === 0) {
    return [''];
  }

  return excludables.map((value) => String(value ?? ''));
};

const parsePriceValue = (rawValue: string): number => {
  if (!rawValue.trim()) {
    return 0;
  }

  const normalized = rawValue.replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getSupportedLanguage = (language: string): SupportedLanguage => {
  const normalized = language.toLowerCase();

  if (normalized.startsWith('fi')) {
    return 'fi';
  }

  if (normalized.startsWith('sv')) {
    return 'sv';
  }

  return 'en';
};

const createEmptyProductTranslations = (): ProductTranslations => ({
  productName: { fi: '', en: '', sv: '' },
  description: { fi: '', en: '', sv: '' },
  ingredients: { fi: '', en: '', sv: '' },
});

const normalizeProductTranslations = (
  productTranslations: unknown,
  fallbackValues: Record<TranslatableField, string>,
  defaultLanguage: SupportedLanguage,
): ProductTranslations => {
  const normalized = createEmptyProductTranslations();

  if (productTranslations && typeof productTranslations === 'object') {
    TRANSLATABLE_FIELDS.forEach((field) => {
      const fieldTranslations = (productTranslations as Partial<Record<TranslatableField, Partial<FieldTranslations>>>)[field];

      if (!fieldTranslations || typeof fieldTranslations !== 'object') {
        return;
      }

      SUPPORTED_LANGUAGES.forEach(({ code }) => {
        const value = fieldTranslations[code];
        normalized[field][code] = typeof value === 'string' ? value : '';
      });
    });
  }

  TRANSLATABLE_FIELDS.forEach((field) => {
    const fallbackValue = fallbackValues[field];
    if (fallbackValue && !normalized[field][defaultLanguage]) {
      normalized[field][defaultLanguage] = fallbackValue;
    }
  });

  return normalized;
};

interface EditProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProductData) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  initialData?: ProductData;
}

type TranslationTargetField = 'productName' | 'description' | 'ingredients' | null;

const EMPTY_PRODUCT_DATA: ProductData = {};

const createInitialDialogState = (
  initialData: ProductData,
  systemLanguage: SupportedLanguage,
) => {
  const initialToppings = normalizeToppings(initialData.toppings);
  const initialExcludables = normalizeExcludables(initialData.excludables);
  const initialFieldValues: Record<TranslatableField, string> = {
    productName: initialData.productName || '',
    description: initialData.description || '',
    ingredients: initialData.ingredients || '',
  };
  const initialProductTranslations = normalizeProductTranslations(
    initialData.productTranslations,
    initialFieldValues,
    systemLanguage,
  );
  const initialProductName = initialData.productName || initialProductTranslations.productName[systemLanguage] || '';
  const initialPrice = initialData.price ?? 0;
  const initialDescription = initialData.description || initialProductTranslations.description[systemLanguage] || '';
  const initialIngredients = initialData.ingredients || initialProductTranslations.ingredients[systemLanguage] || '';
  const initialImagePreview =
    initialData.stockPhotoLink ||
    initialData.ImgUrl ||
    (typeof initialData.productImage === 'string' ? initialData.productImage : null);

  return {
    formData: {
      ...initialData,
      productName: initialProductName,
      price: initialPrice,
      description: initialDescription,
      ingredients: initialIngredients,
      productTranslations: initialProductTranslations,
      productImage: initialData.productImage || null,
      additionalImages: initialData.additionalImages || [],
      toppings: initialToppings,
      excludables: initialExcludables,
      freeToppings: initialData.freeToppings ?? 0,
      maxToppings: initialData.maxToppings ?? 0,
      allergens: initialData.allergens || [],
    } as ProductData,
    imagePreview: initialImagePreview || null,
  };
};

const EditProductDialog: React.FC<EditProductDialogProps> = ({ 
  open, 
  onClose, 
  onSave, 
  onDelete,
  initialData = EMPTY_PRODUCT_DATA,
}) => {
  const { t, i18n } = useTranslation();
  const systemLanguage = getSupportedLanguage(i18n.resolvedLanguage || i18n.language || 'en');
  const initialState = createInitialDialogState(initialData, systemLanguage);

  const [formData, setFormData] = useState<ProductData>(initialState.formData);

  const [imagePreview, setImagePreview] = useState<string | null>(initialState.imagePreview);
  const [isAllergensDialogOpen, setIsAllergensDialogOpen] = useState(false);
  const [isToppingsDialogOpen, setIsToppingsDialogOpen] = useState(false);
  const [isExcludablesDialogOpen, setIsExcludablesDialogOpen] = useState(false);
  const [isStockPhotoDialogOpen, setIsStockPhotoDialogOpen] = useState(false);
  const [translationTargetField, setTranslationTargetField] = useState<TranslationTargetField>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextState = createInitialDialogState(initialData, systemLanguage);
    setFormData(nextState.formData);
    setImagePreview(nextState.imagePreview);
    setTranslationTargetField(null);
  }, [open]);

  const isTranslatableField = (field: keyof ProductData): field is TranslatableField =>
    field === 'productName' || field === 'description' || field === 'ingredients';

  const handleInputChange = (field: keyof ProductData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setFormData((previous) => {
      const next: ProductData = {
        ...previous,
        [field]: value,
      };

      if (isTranslatableField(field)) {
        const currentTranslations = previous.productTranslations || createEmptyProductTranslations();
        next.productTranslations = {
          ...currentTranslations,
          [field]: {
            ...currentTranslations[field],
            [systemLanguage]: value,
          },
        };
      }

      return next;
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

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parsePriceValue(event.target.value);

    setFormData((previous) => ({
      ...previous,
      price: value,
    }));
  };

  const handleAddToppings = () => {
    setIsToppingsDialogOpen(true);
  };

  const handleAddExcludables = () => {
    setIsExcludablesDialogOpen(true);
  };

  const handleEditAllergens = () => {
    setIsAllergensDialogOpen(true);
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
      stockPhotoLink: photo.link,
      ImgUrl: photo.link,
      productImage: null,
    }));
    setImagePreview(photo.link);
  };

  const handleCloseAllergensDialog = () => {
    setIsAllergensDialogOpen(false);
  };

  const handleCloseToppingsDialog = () => {
    setIsToppingsDialogOpen(false);
  };

  const handleCloseExcludablesDialog = () => {
    setIsExcludablesDialogOpen(false);
  };

  const handleOpenTranslationDialog = (field: Exclude<TranslationTargetField, null>) => {
    setTranslationTargetField(field);
  };

  const handleCloseTranslationDialog = () => {
    setTranslationTargetField(null);
  };

  const getTranslationTargetLabel = () => {
    if (translationTargetField === 'productName') {
      return t('admin.productEditor.dialog.productName');
    }

    if (translationTargetField === 'description') {
      return t('admin.productEditor.dialog.description');
    }

    if (translationTargetField === 'ingredients') {
      return t('admin.productEditor.dialog.ingredients');
    }

    return '';
  };

  const handleTranslationValueChange = (language: SupportedLanguage, value: string) => {
    if (!translationTargetField) {
      return;
    }

    setFormData((previous) => {
      const currentTranslations = previous.productTranslations || createEmptyProductTranslations();
      const next: ProductData = {
        ...previous,
        productTranslations: {
          ...currentTranslations,
          [translationTargetField]: {
            ...currentTranslations[translationTargetField],
            [language]: value,
          },
        },
      };

      if (language === systemLanguage) {
        next[translationTargetField] = value;
      }

      return next;
    });
  };

  const getTranslationValue = (language: SupportedLanguage) => {
    if (!translationTargetField) {
      return '';
    }

    const translations = formData.productTranslations || createEmptyProductTranslations();
    return translations[translationTargetField][language] || '';
  };

  const handleToppingsChange = (toppings: ToppingRow[]) => {
    setFormData({
      ...formData,
      toppings,
    });
  };

  const handleToppingsSettingsChange = (settings: { freeToppings: number; maxToppings: number }) => {
    setFormData({
      ...formData,
      freeToppings: settings.freeToppings,
      maxToppings: settings.maxToppings,
    });
  };

  const handleExcludablesChange = (excludables: string[]) => {
    setFormData({
      ...formData,
      excludables,
    });
  };

  const handleSaveAllergens = (allergens: AllergenCode[]) => {
    setFormData({
      ...formData,
      allergens,
    });
  };

  const handleSave = async () => {
    await Promise.resolve(onSave({
      ...formData,
      price: Number.isFinite(formData.price) ? formData.price : 0,
    }));
    onClose();
  };

  const handleDelete = async () => {
    if (onDelete) {
      await Promise.resolve(onDelete());
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
                  onChange={handleImageUpload}
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
                  onClick={() => handleOpenTranslationDialog('productName')}
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
                value={formData.productName}
                onChange={handleInputChange('productName')}
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
                value={formData.price ?? 0}
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
                  onClick={() => handleOpenTranslationDialog('description')}
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('admin.productEditor.dialog.ingredients')}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => handleOpenTranslationDialog('ingredients')}
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
                    {formData.allergens && formData.allergens.length > 0 ? (
                      <Chip
                        label={formData.allergens.join(', ')}
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

      <EditAllergensDialog
        open={isAllergensDialogOpen}
        onClose={handleCloseAllergensDialog}
        selectedAllergens={formData.allergens || []}
        onSave={handleSaveAllergens}
      />

      <EditToppingsDialog
        open={isToppingsDialogOpen}
        onClose={handleCloseToppingsDialog}
        toppings={formData.toppings || [createDefaultToppingRow()]}
        onChange={handleToppingsChange}
        freeToppings={formData.freeToppings ?? 0}
        maxToppings={formData.maxToppings ?? 0}
        onSettingsChange={handleToppingsSettingsChange}
      />

      <EditExcludablesDialog
        open={isExcludablesDialogOpen}
        onClose={handleCloseExcludablesDialog}
        excludables={formData.excludables || ['']}
        onChange={handleExcludablesChange}
      />

      <Dialog
        open={translationTargetField !== null}
        onClose={handleCloseTranslationDialog}
        maxWidth="sm"
        fullWidth
      >
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
            variant="h6"
            component="div"
            fontWeight={theme.typography.fontWeights.semibold}
          >
            {`${t('admin.productEditor.dialog.addTranslation')} - ${getTranslationTargetLabel()}`}
          </Typography>
          <IconButton
            aria-label="close translation dialog"
            onClick={handleCloseTranslationDialog}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: theme.spacing.lg }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
            {SUPPORTED_LANGUAGES.map((language) => (
              <Box key={language.code} sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t(language.labelKey)}
                </Typography>
                <TextField
                  fullWidth
                  value={getTranslationValue(language.code)}
                  onChange={(event) => handleTranslationValueChange(language.code, event.target.value)}
                  multiline={translationTargetField === 'description' || translationTargetField === 'ingredients'}
                  rows={translationTargetField === 'description' ? 4 : translationTargetField === 'ingredients' ? 3 : 1}
                />
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      <StockPhotoDialog
        open={isStockPhotoDialogOpen}
        onClose={handleCloseStockPhotoDialog}
        selectedPhotoLink={formData.stockPhotoLink || formData.ImgUrl || imagePreview || undefined}
        onSave={handleSaveStockPhoto}
      />
    </Dialog>
  );
};

export default EditProductDialog;