import { Box, Typography, TextField, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';

interface CampaignEditorHeaderProps {
  onAddCampaign: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function CampaignEditorHeader({
  onAddCampaign,
  searchQuery,
  onSearchChange,
}: CampaignEditorHeaderProps) {
  const { t } = useTranslation();

  return (
    <Box sx={{ 
      mb: theme.spacing.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      flexWrap: 'wrap',
    }}>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: theme.typography.fontWeights.bold,
        }}
      >
        {t('admin.campaignEditor.title')}
      </Typography>

      <Box sx={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
        <TextField
          placeholder={t('admin.campaignEditor.search')}
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            width: 300,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.colors.border,
              },
              '&:hover fieldset': {
                borderColor: theme.colors.primary,
              },
            },
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddCampaign}
          sx={{
            borderRadius: theme.borderRadius.large,
            textTransform: 'none',
            bgcolor: theme.colors.primary,
            '&:hover': {
              bgcolor: theme.colors.primaryHover,
            },
          }}
        >
          {t('admin.campaignEditor.addCampaign')}
        </Button>
      </Box>
    </Box>
  );
}
