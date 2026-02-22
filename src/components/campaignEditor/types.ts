export interface CampaignCategoryItem {
  id: number;
  name: string;
}

export interface CampaignCategory {
  id: number;
  name: string;
  items: CampaignCategoryItem[];
}

export interface ProductOption {
  id: number;
  name: string;
}

export interface CampaignData {
  campaignName?: string;
  description?: string;
  isActive?: boolean;
  activeDays?: string[];
  activeFrom?: string;
  activeTo?: string;
  categories?: CampaignCategory[];
  [key: string]: any;
}
