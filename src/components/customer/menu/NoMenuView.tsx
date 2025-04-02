
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, Scan } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateTestMenuData } from '@/services/menuService';
import { useQueryClient } from '@tanstack/react-query';

interface NoMenuViewProps {
  restaurantId: string;
  onRescan: () => void;
}

const NoMenuView: React.FC<NoMenuViewProps> = ({ restaurantId, onRescan }) => {
  const queryClient = useQueryClient();

  const handleLoadDemoMenu = () => {
    const data = generateTestMenuData(restaurantId || '');
    
    // Update react-query cache with test data
    queryClient.setQueryData(['menuCategories', restaurantId], data.categories);
    queryClient.setQueryData(['menuItems', restaurantId], data.items);
    
    toast({
      title: "Using Demo Data",
      description: "Showing example menu items for demonstration purposes.",
    });
  };

  return (
    <>
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>No menu items found</AlertTitle>
        <AlertDescription>
          This restaurant hasn't added any menu items yet. We'll show you demo items for testing.
        </AlertDescription>
      </Alert>
      
      <Button 
        variant="default" 
        className="mb-6 w-full"
        onClick={handleLoadDemoMenu}
      >
        Load Demo Menu
      </Button>
      
      <div className="flex justify-center mt-4">
        <Button variant="outline" onClick={onRescan}>
          <Scan className="h-4 w-4 mr-2" />
          Scan Different QR Code
        </Button>
      </div>
    </>
  );
};

export default NoMenuView;
