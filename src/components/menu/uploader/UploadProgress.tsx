
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ isUploading, progress }) => {
  if (!isUploading) return null;
  
  return (
    <div className="space-y-2 p-2 bg-background rounded-md border">
      <div className="flex justify-between text-xs text-foreground">
        <span>Uploading...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2 bg-muted" indicatorClassName="bg-primary" />
    </div>
  );
};

export default UploadProgress;
