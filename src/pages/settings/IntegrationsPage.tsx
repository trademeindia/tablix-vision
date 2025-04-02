
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIntegrations } from '@/hooks/integrations/use-integrations';
import { ArrowRight, Loader2, ExternalLink, RefreshCw } from 'lucide-react';

const IntegrationsPage = () => {
  const { toast } = useToast();
  const { integrations, isLoading } = useIntegrations();
  const [activeTab, setActiveTab] = useState('pos');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConnectZapier = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter your webhook URL",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would save the webhook URL to the database
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      toast({
        title: "Success",
        description: "Zapier webhook connected successfully",
      });
      
      setWebhookUrl('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect Zapier webhook",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { id: 'pos', name: 'POS Systems' },
    { id: 'delivery', name: 'Food Delivery' },
    { id: 'automation', name: 'Automation' },
    { id: 'communication', name: 'Communication' },
    { id: 'analytics', name: 'Analytics' },
  ];

  const integrationsByCategory = categories.reduce((acc, category) => {
    acc[category.id] = integrations.filter(i => i.category === category.id);
    return acc;
  }, {} as Record<string, typeof integrations>);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-slate-500">Connect your restaurant with third-party services</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex flex-wrap">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading ? (
                Array(2).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 w-32 bg-gray-200 rounded"></div>
                      <div className="h-4 w-48 bg-gray-200 rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-10 w-full bg-gray-200 rounded mb-2"></div>
                      <div className="h-8 w-24 bg-gray-200 rounded float-right"></div>
                    </CardContent>
                  </Card>
                ))
              ) : integrationsByCategory[category.id]?.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="pt-6 text-center">
                    <p>No {category.name} integrations available yet.</p>
                  </CardContent>
                </Card>
              ) : (
                integrationsByCategory[category.id]?.map(integration => (
                  <Card key={integration.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        {integration.icon && <integration.icon className="h-5 w-5 mr-2" />}
                        {integration.name}
                      </CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {integration.status === 'connected' ? (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm text-green-600 font-medium mb-1">Connected</p>
                              {integration.lastSynced && (
                                <p className="text-xs text-gray-500">
                                  Last synced: {new Date(integration.lastSynced).toLocaleTimeString()}
                                </p>
                              )}
                            </div>
                            <Button size="sm" variant="outline">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Sync
                            </Button>
                          </div>
                          <div className="flex justify-between">
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                            <Button variant="destructive" size="sm">
                              Disconnect
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button className="w-full">
                          Connect
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            {category.id === 'automation' && (
              <Card>
                <CardHeader>
                  <CardTitle>Zapier Integration</CardTitle>
                  <CardDescription>
                    Connect your restaurant with thousands of apps through Zapier
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleConnectZapier}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="webhook" className="block text-sm font-medium mb-1">
                          Zapier Webhook URL
                        </label>
                        <Input
                          id="webhook"
                          placeholder="https://hooks.zapier.com/hooks/catch/..."
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Create a webhook trigger in Zapier and paste the URL here
                        </p>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('https://zapier.com/apps/webhook', '_blank')}
                        >
                          Zapier Documentation
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                        
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            <>Connect</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </DashboardLayout>
  );
};

export default IntegrationsPage;
