
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-medium">
          Uploading... {Math.round(progress)}%
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Cancel upload</span>
        </Button>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default UploadProgress;
