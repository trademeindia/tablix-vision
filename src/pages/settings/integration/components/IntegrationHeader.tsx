
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Integration } from '@/types/integration';

interface IntegrationHeaderProps {
  integration: Integration;
}

const IntegrationHeader: React.FC<IntegrationHeaderProps> = ({ integration }) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default IntegrationHeader;
