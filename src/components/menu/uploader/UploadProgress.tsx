
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
        <span className="text-sm text-muted-foreground">
          Uploading... {Math.round(progress)}%
        </span>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cancel upload</span>
        </Button>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default UploadProgress;
