import { MOCK_CAMPAIGNS } from '../mockData/campaign.mock';
import { toCampaignListItemViewModel } from '../../viewModels';

export const useGetCampaigns = () => {
  return {
    data: MOCK_CAMPAIGNS.map(toCampaignListItemViewModel),
    loading: false,
    error: undefined,
  } as const;
};
