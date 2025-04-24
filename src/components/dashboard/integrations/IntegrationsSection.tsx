
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIntegrations } from '@/hooks/integrations/use-integrations';
import { useToast } from '@/hooks/use-toast';
import { Integration } from '@/types/integration';

const IntegrationsSection = () => {
  const { integrations, isLoading, syncIntegration, isSyncing } = useIntegrations();
  const { toast } = useToast();

  // Get count of connected integrations
  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  
  // Get recently synced integrations (last 30 minutes)
  const recentlySynced = integrations.filter(i => {
    if (!i.lastSynced) return false;
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    return new Date(i.lastSynced) > thirtyMinutesAgo;
  });

  const handleSyncAll = () => {
    toast({
      title: "Sync initiated",
      description: "Synchronizing all connected integrations...",
    });
    
    // Sync all connected integrations
    integrations
      .filter(i => i.status === 'connected')
      .forEach(integration => {
        syncIntegration(integration.id);
      });
  };

  // console.log('Integrations section rendering:', { integrations, isLoading });

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium">Integrations</CardTitle>
            <CardDescription>Connected third-party services</CardDescription>
          </div>
          <div className="flex gap-2">
            {connectedCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSyncAll}
                disabled={isSyncing}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync All
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link to="/settings/integrations">
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2 border rounded-md animate-pulse">
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : integrations.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500 mb-3">No integrations connected yet</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/settings/integrations">
                Connect your first integration
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {integrations.slice(0, 5).map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  {integration.icon && <integration.icon className="h-5 w-5 mr-3 text-gray-500" />}
                  <div>
                    <p className="font-medium">{integration.name}</p>
                    <p className="text-xs text-gray-500">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {integration.status === 'connected' ? (
                    <Badge 
                      variant="outline"
                      className="bg-green-100 text-green-800 hover:bg-green-100"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  ) : integration.status === 'error' ? (
                    <Badge 
                      variant="outline"
                      className="bg-red-100 text-red-800 hover:bg-red-100"
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Error
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      Configure
                    </Badge>
                  )}
                  <Button variant="ghost" size="icon" className="ml-2" asChild>
                    <Link to={`/settings/integrations/${integration.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
            
            {integrations.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="link" size="sm" asChild>
                  <Link to="/settings/integrations">
                    View all {integrations.length} integrations
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntegrationsSection;
