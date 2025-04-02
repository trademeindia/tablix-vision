
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Integration } from '@/types/integration';
import IntegrationCard from '@/components/integrations/IntegrationCard';

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
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-gray-500 mb-3">
            {category === undefined || category === 'all'
              ? 'No integrations available yet.'
              : `No ${getCategoryName(category)} integrations available yet.`}
          </p>
          <button
            onClick={onAddIntegration}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          >
            Add Integration
          </button>
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

// Helper function to get a human-readable category name
function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    'pos': 'POS Systems',
    'delivery': 'Food Delivery',
    'payment': 'Payment',
    'analytics': 'Analytics',
    'communication': 'Communication',
    'documents': 'Documents',
    'automation': 'Automation',
    'other': 'Other'
  };
  
  return categoryMap[category] || category;
}

export { getCategoryName };
export default CategoryTab;
