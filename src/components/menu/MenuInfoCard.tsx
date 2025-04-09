
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, Box, ImageIcon } from 'lucide-react';

interface MenuInfoCardProps {
  showModel3dInfo?: boolean;
}

const MenuInfoCard: React.FC<MenuInfoCardProps> = ({ showModel3dInfo = false }) => {
  return (
    <div className="mb-6 space-y-4">
      <Alert variant="default" className="border-blue-200 bg-blue-50">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Create categories to organize your menu, then add individual items with descriptions and prices.
        </AlertDescription>
      </Alert>

      {showModel3dInfo && (
        <Alert variant="default" className="border-purple-200 bg-purple-50">
          <Box className="h-4 w-4 text-purple-500" />
          <AlertDescription className="flex flex-col space-y-2">
            <span>Your menu now supports rich media types:</span>
            <ul className="list-disc list-inside text-sm ml-1 space-y-1">
              <li className="flex items-center">
                <Box className="h-3 w-3 mr-1 text-purple-500" />
                <span><strong>3D Models</strong> - Give customers an interactive 360° view of dishes</span>
              </li>
              <li className="flex items-center">
                <ImageIcon className="h-3 w-3 mr-1 text-purple-500" />
                <span><strong>Animated GIFs</strong> - Showcase food preparation or presentation in motion</span>
              </li>
            </ul>
            <span className="text-sm italic">Check out the "Showcase Items" category in the sample menu to see examples.</span>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MenuInfoCard;
