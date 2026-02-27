import { Box } from '@mui/material';
import { theme } from '../theme';
import { useMemo, useState } from 'react';
import CampaignEditorHeader from '../components/campaignEditor/CampaignEditorHeader';
import CampaignList from '../components/campaignEditor/CampaignList';
import EditCampaignDialog from '../components/campaignEditor/EditCampaignDialog';
import type { CampaignListItemViewModel } from '../viewModels';
import { useGetCampaigns } from '../api/hooks/campaign.hooks';

export default function CampaignEditorView() {
  const { data: campaigns } = useGetCampaigns();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignListItemViewModel | null>(null);

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const initialCampaignData = useMemo(
    () =>
      selectedCampaign
        ? {
            campaignName: selectedCampaign.name,
            description: selectedCampaign.description,
            isActive: selectedCampaign.isActive,
          }
        : undefined,
    [selectedCampaign]
  );

  const handleAddCampaign = () => {
    setSelectedCampaign(null);
    setDialogOpen(true);
  };

  const handleCampaignClick = (id: string) => {
    const campaign = filteredCampaigns.find((item) => item.id === id);
    if (campaign) {
      setSelectedCampaign(campaign);
      setDialogOpen(true);
    }
  };

  const handleSaveCampaign = (data: any) => {
    // TODO: Implement save campaign functionality
    console.log('Save campaign:', data);
  };

  const handleDeleteCampaign = () => {
    if (selectedCampaign) {
      // TODO: Implement delete campaign functionality
      console.log('Delete campaign:', selectedCampaign.id);
    }
  };

  return (
    <Box sx={{ p: theme.spacing.lg, width: '100%', bgcolor: theme.colors.background, minHeight: '100vh' }}>
      <CampaignEditorHeader
        onAddCampaign={handleAddCampaign}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <CampaignList campaigns={filteredCampaigns} onCampaignClick={handleCampaignClick} />

      <EditCampaignDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveCampaign}
        onDelete={selectedCampaign ? handleDeleteCampaign : undefined}
        initialData={initialCampaignData}
      />
    </Box>
  );
}
