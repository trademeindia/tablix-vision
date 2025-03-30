
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface UploadButtonProps {
  isVisible: boolean;
  onUpload: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ isVisible, onUpload }) => {
  if (!isVisible) return null;
  
  return (
    <Button 
      onClick={onUpload}
      className="w-full"
    >
      <Upload className="h-4 w-4 mr-2" />
      Upload Model
    </Button>
  );
};

export default UploadButton;
