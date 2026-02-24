import type { Campaign, CampaignProduct } from '../api/types';

export interface CampaignCategoryItemViewModel {
  id: string;
  name: string;
}

export interface CampaignCategoryViewModel {
  id: string;
  name: string;
  items: CampaignCategoryItemViewModel[];
}

export interface CampaignProductOptionViewModel {
  id: string;
  name: string;
}

export interface CampaignListItemViewModel {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface CampaignDataViewModel {
  campaignId?: string;
  campaignName?: string;
  description?: string;
  isActive?: boolean;
  activeDays?: string[];
  activeFrom?: string;
  activeTo?: string;
  categories?: CampaignCategoryViewModel[];
}

export const toCampaignListItemViewModel = (campaign: Campaign): CampaignListItemViewModel => ({
  id: campaign.Id,
  name: campaign.Name ?? '',
  description: campaign.Description ?? '',
  isActive: campaign.Enabled,
});

export const toCampaignDataViewModel = (
  campaign: Campaign,
  campaignProducts: CampaignProduct[] = []
): CampaignDataViewModel => ({
  campaignId: campaign.Id,
  campaignName: campaign.Name ?? '',
  description: campaign.Description ?? '',
  isActive: campaign.Enabled,
  categories: [
    {
      id: `${campaign.Id}-products`,
      name: campaign.Name ?? 'Campaign products',
      items: campaignProducts
        .filter((campaignProduct) => campaignProduct.CampaignId === campaign.Id)
        .map((campaignProduct) => ({
          id: campaignProduct.ProductId,
          name: campaignProduct.Name ?? campaignProduct.ProductId,
        })),
    },
  ],
});
