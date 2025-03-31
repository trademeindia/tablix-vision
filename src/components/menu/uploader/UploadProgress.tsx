
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
  onCancel?: () => void;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ 
  isUploading, 
  progress,
  onCancel
}) => {
  if (!isUploading) return null;
  
  // Calculate estimated time remaining based on progress (simplified version)
  const progressText = progress < 100 
    ? `Uploading: ${Math.round(progress)}%` 
    : 'Processing...';
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium text-foreground">
          {progressText}
        </p>
        {onCancel && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="h-6 px-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cancel</span>
          </Button>
        )}
      </div>
      <Progress 
        value={progress} 
        className="h-2"
        // Add subtle animation for small progress changes
        style={{
          transition: "width 0.5s ease"
        }}
      />
      {progress === 100 && (
        <p className="text-xs text-muted-foreground animate-pulse">
          Finalizing upload and processing the model...
        </p>
      )}
    </div>
  );
};

export default UploadProgress;
