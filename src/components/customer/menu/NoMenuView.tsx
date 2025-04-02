
import React from 'react';
import { Button } from '@/components/ui/button';
import { EmptyPlate } from '@/components/ui/empty-plate';
import { AlertOctagon, RefreshCw, Scan } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { generateTestMenuData } from '@/services/menu';
import { toast } from '@/hooks/use-toast';

interface NoMenuViewProps {
  restaurantId: string;
  onRescan: () => void;
}

const NoMenuView: React.FC<NoMenuViewProps> = ({ restaurantId, onRescan }) => {
  const queryClient = useQueryClient();
  
  const handleLoadTestData = () => {
    // Generate test menu data for this restaurant
    const testData = generateTestMenuData(restaurantId);
    
    // Update the query cache with test data
    queryClient.setQueryData(['menuCategories', restaurantId], testData.categories);
    queryClient.setQueryData(['menuItems', restaurantId], testData.items);
    
    // Show success message
    toast({
      title: "Test menu loaded",
      description: "Now showing example menu items",
    });
    
    // Force a page reload to show the test data
    window.location.reload();
  };
  
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <div className="mb-6">
        <EmptyPlate className="h-32 w-32 text-muted-foreground/50" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-2">No Menu Found</h2>
      
      <div className="mb-4 flex items-center text-amber-600 bg-amber-50 p-2 rounded-md max-w-sm">
        <AlertOctagon className="h-5 w-5 mr-2 flex-shrink-0" />
        <p className="text-sm">We couldn't find any menu items for this restaurant.</p>
      </div>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        The restaurant may not have added any menu items yet, or there might be a connection issue.
      </p>
      
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
        <Button variant="default" onClick={handleLoadTestData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Load Example Menu
        </Button>
        
        <Button variant="outline" onClick={onRescan}>
          <Scan className="h-4 w-4 mr-2" />
          Scan Different QR Code
        </Button>
      </div>
    </div>
  );
};

export default NoMenuView;
