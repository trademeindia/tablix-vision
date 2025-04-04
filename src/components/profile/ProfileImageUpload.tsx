
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, Trash2 } from 'lucide-react';
import { useProfile } from '@/hooks/use-profile';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageChange?: (url: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImageUrl,
  onImageChange,
  size = 'lg',
}) => {
  const { uploadProfileImage } = useProfile();
  const [isUploading, setIsUploading] = useState(false);
  
  const imageSize = {
    sm: 'h-20 w-20',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
    xl: 'h-40 w-40',
  }[size];
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { publicUrl, error } = await uploadProfileImage(file);
      
      if (error) throw error;
      if (publicUrl && onImageChange) onImageChange(publicUrl);
      
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const getInitials = (name?: string): string => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {isUploading ? (
        <Skeleton className={`rounded-full ${imageSize}`} />
      ) : (
        <Avatar className={`${imageSize} border-2 border-primary/10`}>
          <AvatarImage src={currentImageUrl} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials('User')}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          asChild
        >
          <label>
            <Upload className="h-4 w-4" />
            <span>Upload</span>
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </Button>
      </div>
    </div>
  );
};

export default ProfileImageUpload;
