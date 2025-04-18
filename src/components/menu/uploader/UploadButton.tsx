
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface UploadButtonProps {
  isVisible: boolean;
  onUpload: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ isVisible, onUpload }) => {
  if (!isVisible) return null;
  
  return (
    <Button 
      type="button" 
      onClick={onUpload} 
      className="w-full"
    >
      <Upload className="h-4 w-4 mr-2" />
      Upload
    </Button>
  );
};

export default UploadButton;
