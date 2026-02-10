import { Paper, List } from '@mui/material';
import { theme } from '../../theme';
import CampaignListItem from './CampaignListItem';

interface Campaign {
  id: number;
  name: string;
  productCount: number;
  isActive: boolean;
}

interface CampaignListProps {
  campaigns: Campaign[];
  onCampaignClick: (id: number) => void;
}

export default function CampaignList({ campaigns, onCampaignClick }: CampaignListProps) {
  return (
    <Paper
      sx={{
        width: '100%',
        borderRadius: theme.borderRadius.small,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: 1,
        overflow: 'hidden',
      }}
    >
      <List sx={{ p: 0 }}>
        {campaigns.map((campaign, index) => (
          <CampaignListItem
            key={campaign.id}
            id={campaign.id}
            name={campaign.name}
            productCount={campaign.productCount}
            isActive={campaign.isActive}
            isLast={index === campaigns.length - 1}
            onClick={onCampaignClick}
          />
        ))}
      </List>
    </Paper>
  );
}
