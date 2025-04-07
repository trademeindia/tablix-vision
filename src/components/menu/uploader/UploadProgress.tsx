
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
  onCancel: () => void;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ isUploading, progress, onCancel }) => {
  if (!isUploading) return null;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">Uploading to Supabase...</span>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={progress} className="flex-1" />
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onCancel}
          className="h-8 w-8 p-0"
          title="Cancel upload"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cancel</span>
        </Button>
      </div>
    </div>
  );
};

export default UploadProgress;
