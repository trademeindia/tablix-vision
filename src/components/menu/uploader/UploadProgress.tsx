
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
  onCancel: () => void;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ 
  isUploading, 
  progress, 
  onCancel 
}) => {
  if (!isUploading) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          Uploading... {progress}%
        </p>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
          className="h-6 px-2"
        >
          <X className="h-4 w-4" />
          <span className="ml-1 text-xs">Cancel</span>
        </Button>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default UploadProgress;
