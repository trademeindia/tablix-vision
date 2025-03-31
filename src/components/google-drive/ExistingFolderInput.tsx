
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LinkIcon } from 'lucide-react';

interface ExistingFolderInputProps {
  folderIdInput: string;
  setFolderIdInput: (value: string) => void;
  useFolderId: () => void;
}

const ExistingFolderInput: React.FC<ExistingFolderInputProps> = ({
  folderIdInput,
  setFolderIdInput,
  useFolderId
}) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="folderId">Existing Folder ID</Label>
        <div className="flex space-x-2">
          <Input 
            id="folderId" 
            placeholder="Paste Google Drive folder ID here" 
            value={folderIdInput}
            onChange={(e) => setFolderIdInput(e.target.value)}
          />
          <Button onClick={useFolderId} variant="outline">
            <LinkIcon className="h-4 w-4 mr-2" />
            Use
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        If you already have a Google Drive folder, enter its ID above
      </p>
    </div>
  );
};

export default ExistingFolderInput;
