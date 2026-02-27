import type { CampaignListItemViewModel } from '../../viewModels';

const EMPTY_CAMPAIGNS: CampaignListItemViewModel[] = [];

export const useGetCampaigns = () => {
  return {
    data: EMPTY_CAMPAIGNS,
    loading: false,
    error: undefined,
  } as const;
};
