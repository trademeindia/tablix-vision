
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface UploadButtonProps {
  isVisible: boolean;
  onUpload: () => void;
  label?: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({ 
  isVisible, 
  onUpload,
  label = "Upload" 
}) => {
  if (!isVisible) return null;

  return (
    <Button 
      type="button"
      onClick={onUpload}
      className="w-full"
    >
      <Upload className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};

export default UploadButton;
