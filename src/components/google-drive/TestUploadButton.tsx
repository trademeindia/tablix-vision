
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import Spinner from '@/components/ui/spinner';

interface TestUploadButtonProps {
  folderId: string | null;
  isTestingUpload: boolean;
  isCreatingFolder: boolean;
  testUpload: () => Promise<void>;
}

const TestUploadButton: React.FC<TestUploadButtonProps> = ({
  folderId,
  isTestingUpload,
  isCreatingFolder,
  testUpload
}) => {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2">
        Test file upload to the selected folder
      </p>
      <Button 
        onClick={testUpload} 
        disabled={isTestingUpload || isCreatingFolder || !folderId}
        className="w-full"
        variant={!folderId ? "outline" : "default"}
      >
        {isTestingUpload ? <Spinner size="sm" className="mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
        Test Upload
      </Button>
    </div>
  );
};

export default TestUploadButton;
