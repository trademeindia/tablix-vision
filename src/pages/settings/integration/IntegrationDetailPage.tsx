
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, ChevronLeft, RefreshCw, Save, Settings, Trash2 } from 'lucide-react';
import { useIntegrations } from '@/hooks/integrations/use-integrations';
import { useIntegrationConfig } from '@/hooks/integrations/use-integration-config';
import { format } from 'date-fns';
import { SyncConfig } from '@/types/integration';

const IntegrationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { integrations, updateIntegration, deleteIntegration, syncIntegration, isSyncing } = useIntegrations();
  const { 
    credentials, 
    configs, 
    syncConfigs, 
    saveCredential, 
    saveConfig, 
    saveSyncConfig, 
    testConnection,
    isTestingConnection 
  } = useIntegrationConfig(id || '');
  
  const [integration, setIntegration] = useState(
    integrations.find(i => i.id === id) || null
  );

  const [activeTab, setActiveTab] = useState("general");
  const [newSyncConfig, setNewSyncConfig] = useState<SyncConfig>({
    entity: '',
    direction: 'import',
    mappings: {}, // Required by the SyncConfig type
    enabled: true
  });

  useEffect(() => {
    const foundIntegration = integrations.find(i => i.id === id);
    console.log('IntegrationDetailPage found integration:', foundIntegration);
    setIntegration(foundIntegration || null);
  }, [integrations, id]);

  useEffect(() => {
    console.log('IntegrationDetailPage state:', { 
      integration, 
      credentials, 
      configs, 
      syncConfigs 
    });
  }, [integration, credentials, configs, syncConfigs]);

  if (!integration) {
    return (
      <DashboardLayout>
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/settings/integrations')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Integration Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>The integration you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-4" onClick={() => navigate('/settings/integrations')}>
              Go Back to Integrations
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const handleAddSyncConfig = () => {
    if (id && newSyncConfig.entity) {
      saveSyncConfig({
        integration_id: id,
        syncConfig: newSyncConfig
      });
      
      // Reset the form
      setNewSyncConfig({
        entity: '',
        direction: 'import',
        mappings: {}, // Required by the SyncConfig type
        enabled: true
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/settings/integrations')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{integration.name}</h1>
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Connected
          </span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => syncIntegration(integration.id)}
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Now
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => {
              deleteIntegration(integration.id);
              navigate('/settings/integrations');
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="credentials">
            <Settings className="h-4 w-4 mr-2" />
            Credentials
          </TabsTrigger>
          <TabsTrigger value="sync">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          {/* General settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic integration settings</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Form content */}
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="integration-name">Integration Name</Label>
                  <Input 
                    id="integration-name" 
                    value={integration.name}
                    onChange={(e) => setIntegration({...integration, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="integration-description">Description</Label>
                  <Input 
                    id="integration-description" 
                    value={integration.description}
                    onChange={(e) => setIntegration({...integration, description: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="sync-frequency">Sync Frequency</Label>
                  <Select 
                    value={integration.syncFrequency || 'manual'} 
                    onValueChange={(value: any) => setIntegration({...integration, syncFrequency: value})}
                  >
                    <SelectTrigger id="sync-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Realtime</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => {
                    if (integration.id) {
                      updateIntegration({
                        id: integration.id,
                        name: integration.name,
                        description: integration.description,
                        syncFrequency: integration.syncFrequency
                      });
                    }
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials">
          {/* Credentials */}
          <Card>
            <CardHeader>
              <CardTitle>API Credentials</CardTitle>
              <CardDescription>Configure the credentials needed to connect to this service</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Credentials form */}
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input id="api-key" type="password" placeholder="Enter API key" />
                </div>
                <div>
                  <Label htmlFor="api-secret">API Secret</Label>
                  <Input id="api-secret" type="password" placeholder="Enter API secret" />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => testConnection()}
                    disabled={isTestingConnection}
                  >
                    {isTestingConnection ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Credentials
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync">
          {/* Sync Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Sync Configuration</CardTitle>
              <CardDescription>Configure data synchronization between systems</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Sync config form */}
              {syncConfigs && syncConfigs.length > 0 ? (
                <div className="space-y-4">
                  {syncConfigs.map((config, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{config.entity}</h3>
                        <Badge variant={config.enabled ? "default" : "outline"}>
                          {config.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-500">
                        Direction: {config.direction}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">
                  No sync configurations defined yet
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Add New Sync Configuration</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="entity">Entity</Label>
                      <Input 
                        id="entity" 
                        value={newSyncConfig.entity} 
                        onChange={(e) => setNewSyncConfig(prev => ({ ...prev, entity: e.target.value }))}
                        placeholder="e.g., menu_items, orders, customers" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="direction">Direction</Label>
                      <Select 
                        value={newSyncConfig.direction} 
                        onValueChange={(value: 'import' | 'export' | 'bidirectional') => 
                          setNewSyncConfig(prev => ({ ...prev, direction: value }))
                        }
                      >
                        <SelectTrigger id="direction">
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="import">Import (External → Our System)</SelectItem>
                          <SelectItem value="export">Export (Our System → External)</SelectItem>
                          <SelectItem value="bidirectional">Bidirectional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="enabled">Enabled</Label>
                      <div className="flex items-center pt-2">
                        <Switch 
                          id="enabled" 
                          checked={newSyncConfig.enabled} 
                          onCheckedChange={(checked) => 
                            setNewSyncConfig(prev => ({ ...prev, enabled: checked }))
                          } 
                        />
                        <span className="ml-2 text-sm text-gray-500">
                          {newSyncConfig.enabled ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleAddSyncConfig} disabled={!newSyncConfig.entity}>
                    <Save className="h-4 w-4 mr-2" />
                    Add Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default IntegrationDetailPage;
