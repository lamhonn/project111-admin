import { Box } from '@mui/material';
import { theme } from '../theme';
import { useState } from 'react';
import CampaignEditorHeader from '../components/campaignEditor/CampaignEditorHeader';
import CampaignList from '../components/campaignEditor/CampaignList';
import EditCampaignDialog from '../components/campaignEditor/EditCampaignDialog';

interface Campaign {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export default function CampaignEditorView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Placeholder data - replace with actual data fetching
  const mockCampaigns = [
    { 
      id: 1, 
      name: 'Summer Sale 2026', 
      description: 'Special summer discounts on selected items and refreshing beverages',
      isActive: true 
    },
    { 
      id: 2, 
      name: 'Happy Hour Special', 
      description: 'Discounted drinks and appetizers during happy hour times',
      isActive: true 
    },
    { 
      id: 3, 
      name: 'Weekend Brunch Deal', 
      description: 'Special brunch menu with exclusive pricing every Saturday and Sunday',
      isActive: false 
    },
    { 
      id: 4, 
      name: 'Valentine\'s Day Menu', 
      description: 'Romantic dinner packages and special desserts for couples',
      isActive: false 
    },
    { 
      id: 5, 
      name: 'Student Discount', 
      description: '15% off for students with valid student ID on weekdays',
      isActive: true 
    },
  ];

  const handleAddCampaign = () => {
    setSelectedCampaign(null);
    setDialogOpen(true);
  };

  const handleCampaignClick = (id: number) => {
    const campaign = mockCampaigns.find(c => c.id === id);
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

      <CampaignList campaigns={mockCampaigns} onCampaignClick={handleCampaignClick} />

      <EditCampaignDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveCampaign}
        onDelete={selectedCampaign ? handleDeleteCampaign : undefined}
        initialData={selectedCampaign ? {
          campaignName: selectedCampaign.name,
          description: selectedCampaign.description,
          isActive: selectedCampaign.isActive,
        } : undefined}
      />
    </Box>
  );
}
