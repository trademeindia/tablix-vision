
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, FormItem, FormLabel, FormControl, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StaffFormData } from '@/types/staff';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface StaffFormProps {
  form: UseFormReturn<StaffFormData>;
}

const StaffForm: React.FC<StaffFormProps> = ({ form }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Handle file selection for profile image
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Update the form value with the selected file
    form.setValue('profile_image', file);
    
    // Create preview URL for the selected image
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Clean up the object URL when no longer needed
    return () => URL.revokeObjectURL(objectUrl);
  };
  
  // Clear the selected image
  const clearImage = () => {
    form.setValue('profile_image', null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };
  
  return (
    <>
      <div className="mb-6 flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-3">
          <AvatarImage src={previewUrl || ''} alt="Staff avatar" />
          <AvatarFallback>
            {form.watch('name') ? form.watch('name').split(' ').map(n => n[0]).join('').toUpperCase() : 'ST'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col items-center gap-2">
          <FormField
            control={form.control}
            name="profile_image"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex flex-col gap-2 items-center">
                    <label 
                      htmlFor="profile-image-upload" 
                      className="cursor-pointer flex items-center gap-2 border rounded-md px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Profile Image</span>
                      <input
                        {...field}
                        id="profile-image-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileSelect}
                      />
                    </label>
                    
                    {previewUrl && (
                      <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearImage}
                        className="text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="john@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input placeholder="+1 (555) 123-4567" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Waiter">Waiter</SelectItem>
                <SelectItem value="Chef">Chef</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Receptionist">Receptionist</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="salary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salary</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="3000" 
                {...field} 
                value={field.value || ''} 
                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="emergency_contact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Emergency Contact</FormLabel>
            <FormControl>
              <Input 
                placeholder="Contact name and number" 
                {...field} 
                value={field.value || ''} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default StaffForm;
