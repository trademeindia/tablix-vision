
export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin';

export type PlatformSelection = {
  [key in SocialPlatform]: boolean;
};

export type CampaignStatus = 'draft' | 'scheduled' | 'sent' | 'failed';

export interface Campaign {
  id: string;
  restaurant_id: string;
  campaign_name: string;
  campaign_text: string;
  campaign_image?: string;
  scheduled_time: string;
  platform_selection: PlatformSelection;
  status: CampaignStatus;
  created_at?: string;
  updated_at?: string;
}
