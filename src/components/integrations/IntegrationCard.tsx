
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Integration } from '@/types/integration';
import { ExternalLink, RefreshCw, Loader2, Settings, Trash2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';

interface IntegrationCardProps {
  integration: Integration;
  onSync: (id: string) => void;
  onDelete: (id: string) => void;
  isSyncing: boolean;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ 
  integration, 
  onSync, 
  onDelete,
  isSyncing 
}) => {
  console.log('Rendering IntegrationCard for:', integration.name);
  const isConnected = integration.status === 'connected';
  
  // Format last synced date if available
  const formattedLastSync = integration.lastSynced 
    ? formatDistanceToNow(new Date(integration.lastSynced), { addSuffix: true })
    : 'Never';
  
  const tooltipLastSync = integration.lastSynced 
    ? format(new Date(integration.lastSynced), 'PPpp')
    : '';
    
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          {integration.icon && <integration.icon className="h-5 w-5 mr-2" />}
          {integration.name}
        </CardTitle>
        <CardDescription>{integration.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        {isConnected ? (
          <div className="flex-grow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1 flex items-center">
                  <Check className="h-3 w-3 mr-1" /> Connected
                </p>
                {integration.lastSynced && (
                  <p className="text-xs text-gray-500" title={tooltipLastSync}>
                    Last synced: {formattedLastSync}
                  </p>
                )}
                {integration.syncFrequency && (
                  <p className="text-xs text-gray-500">
                    Sync frequency: {integration.syncFrequency}
                  </p>
                )}
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onSync(integration.id)}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Sync Now
              </Button>
            </div>
            <div className="flex justify-between mt-auto">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/settings/integrations/${integration.id}`}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Link>
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => onDelete(integration.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            className="w-full mt-auto" 
            asChild
          >
            <Link to={`/settings/integrations/${integration.id}/setup`}>
              Connect
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
