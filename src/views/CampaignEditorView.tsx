import { Box } from '@mui/material';
import { theme } from '../theme';
import { useState } from 'react';
import CampaignEditorHeader from '../components/campaignEditor/CampaignEditorHeader';
import CampaignList from '../components/campaignEditor/CampaignList';

export default function CampaignEditorView() {
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data - replace with actual data fetching
  const mockCampaigns = [
    { id: 1, name: 'Summer Sale 2026', productCount: 15, isActive: true },
    { id: 2, name: 'Happy Hour Special', productCount: 8, isActive: true },
    { id: 3, name: 'Weekend Brunch Deal', productCount: 12, isActive: false },
    { id: 4, name: 'Valentine\'s Day Menu', productCount: 10, isActive: false },
    { id: 5, name: 'Student Discount', productCount: 20, isActive: true },
  ];

  const handleAddCampaign = () => {
    // TODO: Implement add campaign functionality
    console.log('Add campaign clicked');
  };

  const handleCampaignClick = (id: number) => {
    // TODO: Implement campaign click/edit functionality
    console.log('Campaign clicked:', id);
  };

  return (
    <Box sx={{ p: theme.spacing.lg, width: '100%', bgcolor: theme.colors.background, minHeight: '100vh' }}>
      <CampaignEditorHeader
        onAddCampaign={handleAddCampaign}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <CampaignList campaigns={mockCampaigns} onCampaignClick={handleCampaignClick} />
    </Box>
  );
}
