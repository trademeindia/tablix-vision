
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Integration } from '@/types/integration';
import IntegrationCard from '@/components/integrations/IntegrationCard';
import { getCategoryName } from '@/utils/integration-categories';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CategoryTabProps {
  integrations: Integration[];
  isLoading: boolean;
  onSync: (id: string) => void;
  onDelete: (id: string) => void;
  isSyncing: boolean;
  onAddIntegration: () => void;
  category?: string;
}

const CategoryTab: React.FC<CategoryTabProps> = ({
  integrations,
  isLoading,
  onSync,
  onDelete,
  isSyncing,
  onAddIntegration,
  category
}) => {
  /* Uncomment if needed for debugging
  console.log('CategoryTab rendering:', { 
    integrations, 
    isLoading, 
    category, 
    integrationCount: integrations.length 
  });
  */

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-24 bg-gray-200 rounded float-right"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (integrations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center p-8">
          <p className="text-sm text-gray-500 mb-3">
            {category === undefined || category === 'all'
              ? 'No integrations available yet.'
              : `No ${getCategoryName(category)} integrations available yet.`}
          </p>
          <Button onClick={onAddIntegration} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {integrations.map(integration => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          onSync={onSync}
          onDelete={onDelete}
          isSyncing={isSyncing}
        />
      ))}
    </div>
  );
};

export default CategoryTab;
