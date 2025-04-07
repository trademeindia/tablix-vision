
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Box, Info } from 'lucide-react';

interface MenuInfoCardProps {
  showModel3dInfo?: boolean;
}

const MenuInfoCard: React.FC<MenuInfoCardProps> = ({ showModel3dInfo = true }) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-medium text-sm mb-1">Menu Management</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Create categories and add items to organize your restaurant menu. Items can be moved between categories and reordered.
            </p>
            
            {showModel3dInfo && (
              <div className="mt-3 bg-blue-50 p-2 rounded-md flex items-start space-x-2">
                <Box className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-700">
                  <p className="font-medium">New: 3D Model Support</p>
                  <p className="mt-0.5">
                    You can now upload 3D models (GLB/GLTF format) for your menu items. 
                    Add a model when creating or editing an item, and customers will 
                    be able to view it in 3D from the menu.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuInfoCard;
