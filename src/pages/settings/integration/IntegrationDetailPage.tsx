
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ArrowLeft, Save, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIntegrationConfig } from '@/hooks/integrations/use-integration-config';

const credentialSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
  is_encrypted: z.boolean().default(true),
});

const configSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
});

const syncConfigSchema = z.object({
  entity: z.string().min(1, 'Entity is required'),
  direction: z.enum(['import', 'export', 'bidirectional']),
  enabled: z.boolean().default(true),
});

const IntegrationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('credentials');
  
  const integrationId = id || '';
  const { 
    credentials, 
    configs, 
    syncConfigs,
    isLoadingCredentials,
    isLoadingConfigs,
    isLoadingSyncConfigs,
    isTestingConnection,
    saveCredential,
    saveConfig,
    saveSyncConfig,
    testConnection
  } = useIntegrationConfig(integrationId);

  const credentialForm = useForm<z.infer<typeof credentialSchema>>({
    resolver: zodResolver(credentialSchema),
    defaultValues: {
      key: '',
      value: '',
      is_encrypted: true,
    },
  });

  const configForm = useForm<z.infer<typeof configSchema>>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      key: '',
      value: '',
    },
  });

  const syncConfigForm = useForm<z.infer<typeof syncConfigSchema>>({
    resolver: zodResolver(syncConfigSchema),
    defaultValues: {
      entity: '',
      direction: 'import',
      enabled: true,
    },
  });

  const onCredentialSubmit = (values: z.infer<typeof credentialSchema>) => {
    saveCredential({
      integration_id: integrationId,
      key: values.key,
      value: values.value,
      is_encrypted: values.is_encrypted,
    });
    credentialForm.reset();
  };

  const onConfigSubmit = (values: z.infer<typeof configSchema>) => {
    saveConfig({
      integration_id: integrationId,
      key: values.key,
      value: values.value,
    });
    configForm.reset();
  };

  const onSyncConfigSubmit = (values: z.infer<typeof syncConfigSchema>) => {
    saveSyncConfig({
      integration_id: integrationId,
      syncConfig: values,
    });
    syncConfigForm.reset();
  };

  const handleTestConnection = async () => {
    const success = await testConnection();
    if (success) {
      // If connection successful, you might want to update the integration status
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="mb-4" 
          onClick={() => navigate('/settings/integrations')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Integrations
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Integration Configuration</h1>
            <p className="text-slate-500">Configure authentication and synchronization settings</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleTestConnection} disabled={isTestingConnection}>
              {isTestingConnection ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test Connection
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="mapping">Data Mapping</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="credentials">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API Credentials</CardTitle>
                <CardDescription>
                  Add authentication credentials for this integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...credentialForm}>
                  <form onSubmit={credentialForm.handleSubmit(onCredentialSubmit)} className="space-y-4">
                    <FormField
                      control={credentialForm.control}
                      name="key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Key</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., api_key" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={credentialForm.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter credential value" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={credentialForm.control}
                      name="is_encrypted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Encrypt Value</FormLabel>
                            <FormDescription>
                              Securely store this credential value
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Credential
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Saved Credentials</CardTitle>
                <CardDescription>
                  View and manage your saved API credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingCredentials ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : credentials && credentials.length > 0 ? (
                  <div className="space-y-4">
                    {credentials.map((credential, index) => (
                      <div key={index} className="flex justify-between items-center border p-3 rounded-md">
                        <div>
                          <p className="font-medium">{credential.key}</p>
                          <p className="text-sm text-gray-500">
                            {credential.is_encrypted ? '••••••••' : credential.value}
                          </p>
                        </div>
                        <Button variant="destructive" size="sm">
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      No credentials found. Add API credentials to connect with this service.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="configuration">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>
                  Configure general settings for this integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...configForm}>
                  <form onSubmit={configForm.handleSubmit(onConfigSubmit)} className="space-y-4">
                    <FormField
                      control={configForm.control}
                      name="key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Setting Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., sync_frequency" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={configForm.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Setting Value</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter setting value" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Setting
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Saved Settings</CardTitle>
                <CardDescription>
                  View and manage your saved configuration settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingConfigs ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : configs && configs.length > 0 ? (
                  <div className="space-y-4">
                    {configs.map((config, index) => (
                      <div key={index} className="flex justify-between items-center border p-3 rounded-md">
                        <div>
                          <p className="font-medium">{config.key}</p>
                          <p className="text-sm text-gray-500">{config.value}</p>
                        </div>
                        <Button variant="destructive" size="sm">
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      No settings found. Add configuration settings for this integration.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="mapping">
          <Card>
            <CardHeader>
              <CardTitle>Data Mapping Configuration</CardTitle>
              <CardDescription>
                Configure how data should be synchronized between systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...syncConfigForm}>
                <form onSubmit={syncConfigForm.handleSubmit(onSyncConfigSubmit)} className="space-y-4">
                  <FormField
                    control={syncConfigForm.control}
                    name="entity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entity Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., orders, products, customers" {...field} />
                        </FormControl>
                        <FormDescription>
                          Define what type of data will be synchronized
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={syncConfigForm.control}
                    name="direction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sync Direction</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select direction" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="import">Import (From API to Us)</SelectItem>
                            <SelectItem value="export">Export (From Us to API)</SelectItem>
                            <SelectItem value="bidirectional">Bidirectional</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Determine how data should flow between systems
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={syncConfigForm.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Enable Synchronization</FormLabel>
                          <FormDescription>
                            Turn this mapping on or off
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="my-4" />
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-sm text-yellow-700">
                      <strong>Note:</strong> Field mapping functionality will be available in a future update.
                      This will allow you to map specific fields from the API to your database schema.
                    </p>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Mapping
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Synchronization Logs</CardTitle>
              <CardDescription>
                View the history of data synchronization for this integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
                <p className="text-gray-500">
                  No synchronization logs found. Logs will appear after data has been synchronized.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default IntegrationDetailPage;
