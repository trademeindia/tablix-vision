import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CampaignForm from '@/components/marketing/CampaignForm';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, CalendarDays, BarChart3, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Campaign, CampaignStatus } from '@/types/marketing';

const MarketingPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // In a real app, fetch campaigns from Supabase
  React.useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        // Mock API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample data - in a real app you'd fetch from Supabase
        setCampaigns([
          {
            id: '1',
            restaurant_id: '123',
            campaign_name: 'Weekend Special',
            campaign_text: 'Enjoy 20% off on all desserts this weekend!',
            campaign_image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b',
            scheduled_time: '2023-09-15T18:00:00Z',
            platform_selection: {
              facebook: true,
              instagram: true,
              twitter: false,
              linkedin: false
            },
            status: 'sent'
          },
          {
            id: '2',
            restaurant_id: '123',
            campaign_name: 'New Menu Launch',
            campaign_text: 'Exciting new dishes added to our menu. Come try them out!',
            scheduled_time: '2023-09-22T12:00:00Z',
            platform_selection: {
              facebook: true,
              instagram: true,
              twitter: true,
              linkedin: false
            },
            status: 'scheduled'
          }
        ]);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast({
          title: 'Error',
          description: 'Failed to load marketing campaigns',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [toast]);

  const handleCreateCampaign = async (formData: any) => {
    setIsSaving(true);
    try {
      // Prepare campaign data for Supabase
      const campaignData: Campaign = {
        id: Math.random().toString(36).substr(2, 9),
        restaurant_id: '123e4567-e89b-12d3-a456-426614174000', // In a real app, get from auth context
        campaign_name: formData.campaignName,
        campaign_text: formData.campaignText,
        campaign_image: formData.campaignImage,
        scheduled_time: new Date(
          `${formData.scheduledDate.toISOString().split('T')[0]}T${formData.scheduledTime}:00`
        ).toISOString(),
        platform_selection: {
          facebook: formData.platforms.facebook || false,
          instagram: formData.platforms.instagram || false,
          twitter: formData.platforms.twitter || false,
          linkedin: false // Default value as it wasn't in the form
        },
        status: 'scheduled' as CampaignStatus // Explicitly cast to CampaignStatus
      };
      
      // Mock API call - in a real app, you'd use Supabase
      // const { data, error } = await supabase
      //   .from('marketing_campaigns')
      //   .insert(campaignData)
      //   .select()
      //   .single();
      
      // if (error) throw error;
      
      setCampaigns(prev => [campaignData, ...prev]);
      
      toast({
        title: 'Campaign Created',
        description: 'Your marketing campaign has been scheduled successfully',
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to create marketing campaign',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketing</h1>
          <p className="text-slate-500">Manage your marketing campaigns</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Create and schedule a new marketing campaign for your restaurant
              </DialogDescription>
            </DialogHeader>
            <CampaignForm onSubmit={handleCreateCampaign} isSubmitting={isSaving} />
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <div className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="flex justify-center p-6">
                  <p>Loading campaigns...</p>
                </CardContent>
              </Card>
            ) : campaigns.filter(c => c.status === 'scheduled').length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                  <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Upcoming Campaigns</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any scheduled marketing campaigns.
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)}>Create New Campaign</Button>
                </CardContent>
              </Card>
            ) : (
              campaigns
                .filter(campaign => campaign.status === 'scheduled')
                .map(campaign => (
                  <Card key={campaign.id}>
                    <CardHeader className="pb-2">
                      <CardTitle>{campaign.campaign_name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatScheduledTime(campaign.scheduled_time)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{campaign.campaign_text}</p>
                      
                      {campaign.campaign_image && (
                        <div className="rounded-md overflow-hidden mb-4 h-40 bg-slate-100">
                          <img 
                            src={campaign.campaign_image} 
                            alt={campaign.campaign_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-2">
                        <p className="text-xs text-muted-foreground">Platforms:</p>
                        {campaign.platform_selection.facebook && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Facebook</span>
                        )}
                        {campaign.platform_selection.instagram && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Instagram</span>
                        )}
                        {campaign.platform_selection.twitter && (
                          <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded">Twitter</span>
                        )}
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                        <Button variant="destructive" size="sm">Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="sent">
          <div className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="flex justify-center p-6">
                  <p>Loading campaigns...</p>
                </CardContent>
              </Card>
            ) : campaigns.filter(c => c.status === 'sent').length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                  <h3 className="text-lg font-medium mb-2">No Sent Campaigns</h3>
                  <p className="text-muted-foreground">You haven't sent any marketing campaigns yet.</p>
                </CardContent>
              </Card>
            ) : (
              campaigns
                .filter(campaign => campaign.status === 'sent')
                .map(campaign => (
                  <Card key={campaign.id}>
                    <CardHeader className="pb-2">
                      <CardTitle>{campaign.campaign_name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Sent: {formatScheduledTime(campaign.scheduled_time)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{campaign.campaign_text}</p>
                      {campaign.campaign_image && (
                        <div className="rounded-md overflow-hidden mb-4 h-40 bg-slate-100">
                          <img 
                            src={campaign.campaign_image} 
                            alt={campaign.campaign_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">View Analytics</Button>
                        <Button variant="outline" size="sm">Resend</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="drafts">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-10 text-center">
              <h3 className="text-lg font-medium mb-2">No Draft Campaigns</h3>
              <p className="text-muted-foreground">You don't have any draft campaigns.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>View the performance of your marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Analytics Data Available</h3>
              <p className="text-muted-foreground mb-4 text-center max-w-md">
                Analytics will be available after you've sent campaigns and received engagement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default MarketingPage;
