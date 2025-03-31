
import React from 'react';
import { Button } from '@/components/ui/button';
import { FolderPlus, LinkIcon } from 'lucide-react';
import Spinner from '@/components/ui/spinner';

interface CreateFolderButtonProps {
  isCreatingFolder: boolean;
  isTestingUpload: boolean;
  createTestFolder: () => Promise<void>;
  driveUrl: string | null;
}

const CreateFolderButton: React.FC<CreateFolderButtonProps> = ({
  isCreatingFolder,
  isTestingUpload,
  createTestFolder,
  driveUrl
}) => {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2">
        Create a new test folder in Google Drive
      </p>
      <Button 
        onClick={createTestFolder} 
        disabled={isCreatingFolder || isTestingUpload}
        className="w-full"
      >
        {isCreatingFolder ? <Spinner size="sm" className="mr-2" /> : <FolderPlus className="h-4 w-4 mr-2" />}
        Create Test Folder
      </Button>
      
      {driveUrl && (
        <div className="pt-2">
          <a 
            href={driveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline flex items-center"
          >
            <LinkIcon className="h-3 w-3 mr-1" />
            View folder in Google Drive
          </a>
        </div>
      )}
    </div>
  );
};

export default CreateFolderButton;
