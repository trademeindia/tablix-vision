
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, FormItem, FormLabel, FormControl, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StaffFormData } from '@/types/staff';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StaffFormProps {
  form: UseFormReturn<StaffFormData>;
}

const StaffForm: React.FC<StaffFormProps> = ({ form }) => {
  const avatarValue = form.watch('avatar');
  
  return (
    <>
      <div className="mb-6 flex justify-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarValue || ''} alt="Staff avatar" />
          <AvatarFallback>
            {form.watch('name') ? form.watch('name').split(' ').map(n => n[0]).join('').toUpperCase() : 'ST'}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <FormField
        control={form.control}
        name="avatar"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profile Image URL</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/avatar.jpg" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
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
