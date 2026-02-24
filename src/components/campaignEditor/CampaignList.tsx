import { Box } from '@mui/material';
import { theme } from '../../theme';
import CampaignListItem from './CampaignListItem';
import type { CampaignListItemViewModel } from '../../viewModels';

interface CampaignListProps {
  campaigns: CampaignListItemViewModel[];
  onCampaignClick: (id: string) => void;
}

export default function CampaignList({ campaigns, onCampaignClick }: CampaignListProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr',
          md: '1fr',
        },
        gap: theme.spacing.md,
      }}
    >
      {campaigns.map((campaign) => (
        <CampaignListItem
          key={campaign.id}
          id={campaign.id}
          name={campaign.name}
          description={campaign.description}
          isActive={campaign.isActive}
          onClick={onCampaignClick}
        />
      ))}
    </Box>
  );
}
