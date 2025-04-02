
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Check, RefreshCw, Save, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIntegrations } from '@/hooks/integrations/use-integrations';
import { useIntegrationConfig } from '@/hooks/integrations/use-integration-config';
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';

const IntegrationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { integrations, updateIntegration, deleteIntegration, syncIntegration, isSyncing } = useIntegrations();
  
  // Find current integration
  const integration = integrations.find(i => i.id === id);
  
  // State for form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [syncFrequency, setSyncFrequency] = useState<string>('');
  const [activeTab, setActiveTab] = useState('general');
  
  // Set initial form values when integration data loads
  useEffect(() => {
    if (integration) {
      setName(integration.name);
      setDescription(integration.description || '');
      setApiEndpoint(integration.apiEndpoint || '');
      setWebhookUrl(integration.webhookUrl || '');
      setSyncFrequency(integration.syncFrequency || 'manual');
    }
  }, [integration]);
  
  // Handle save
  const handleSave = () => {
    if (!integration || !id) return;
    
    updateIntegration({
      id,
      name,
      description,
      apiEndpoint,
      webhookUrl,
      syncFrequency: syncFrequency as any
    });
    
    toast({
      title: "Integration updated",
      description: "Your changes have been saved successfully."
    });
  };
  
  // Handle delete
  const handleDelete = () => {
    if (!id) return;
    
    // Confirmation dialog would be ideal here
    const confirmed = window.confirm("Are you sure you want to disconnect this integration? This action cannot be undone.");
    
    if (confirmed) {
      deleteIntegration(id);
      navigate('/settings/integrations');
      
      toast({
        title: "Integration disconnected",
        description: "The integration has been successfully disconnected."
      });
    }
  };
  
  // Handle manual sync
  const handleSync = () => {
    if (id) {
      syncIntegration(id);
    }
  };
  
  if (!integration) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/settings/integrations')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Integrations
          </Button>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Integration not found. It may have been deleted or disconnected.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="space-y-1">
            <Button 
              variant="outline" 
              onClick={() => navigate('/settings/integrations')}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Integrations
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{integration.name}</h1>
            <p className="text-sm text-muted-foreground">{integration.description}</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            {integration.status === 'connected' ? (
              <Badge variant="outline" className="bg-green-100 text-green-800">
                <Check className="mr-1 h-3 w-3" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                Setup Required
              </Badge>
            )}
            {integration.lastSynced && (
              <span className="text-xs text-gray-500">
                Last synced: {format(new Date(integration.lastSynced), 'MMM d, yyyy h:mm a')}
              </span>
            )}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="sync">Sync Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>
                  Manage basic settings for this integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Integration Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apiEndpoint">API Endpoint URL</Label>
                  <Input 
                    id="apiEndpoint" 
                    value={apiEndpoint} 
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    placeholder="https://api.example.com"
                  />
                  <p className="text-sm text-muted-foreground">
                    The base URL for the third-party API.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input 
                    id="webhookUrl" 
                    value={webhookUrl} 
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://hooks.example.com/webhook"
                  />
                  <p className="text-sm text-muted-foreground">
                    Webhook URL to receive data from the third-party service.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="sync">
            <Card>
              <CardHeader>
                <CardTitle>Sync Settings</CardTitle>
                <CardDescription>
                  Configure how and when data is synchronized
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="syncFrequency">Sync Frequency</Label>
                  <Select value={syncFrequency} onValueChange={setSyncFrequency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableSync">Enable Automatic Sync</Label>
                    <Switch id="enableSync" defaultChecked={syncFrequency !== 'manual'} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, data will be synchronized automatically according to the frequency setting.
                  </p>
                </div>
                
                <Button 
                  variant="outline"
                  className="w-full" 
                  onClick={handleSync}
                  disabled={isSyncing}
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Synchronizing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Now
                    </>
                  )}
                </Button>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="credentials">
            <Card>
              <CardHeader>
                <CardTitle>API Credentials</CardTitle>
                <CardDescription>
                  Manage authentication credentials for this integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input id="apiKey" type="password" placeholder="Enter API key" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apiSecret">API Secret</Label>
                    <Input id="apiSecret" type="password" placeholder="Enter API secret" />
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    Verify Credentials
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Credentials
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Configure advanced options for this integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="debug">Debug Mode</Label>
                      <Switch id="debug" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed logging for troubleshooting.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="errorNotify">Error Notifications</Label>
                      <Switch id="errorNotify" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when integration errors occur.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                    <Input id="timeout" type="number" defaultValue="30" min="5" max="300" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default IntegrationDetailPage;
