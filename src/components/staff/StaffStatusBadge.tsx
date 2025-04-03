
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { StaffMember } from '@/types/staff';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StaffStatusBadgeProps {
  staff: StaffMember;
  onStatusChange: () => void;
}

const StaffStatusBadge: React.FC<StaffStatusBadgeProps> = ({ staff, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  const handleStatusToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isUpdating) return;
    
    setIsUpdating(true);
    const newStatus = staff.status === 'active' ? 'inactive' : 'active';
    
    try {
      console.log(`Updating status for staff ID ${staff.id} to ${newStatus}`);
      
      // If using demo data (IDs starting with 'staff-'), simulate update
      if (staff.id.startsWith('staff-')) {
        // Wait a moment to simulate server processing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        toast({
          title: 'Status Updated (Demo)',
          description: `${staff.name} is now ${newStatus} (Note: This is demo data)`,
        });
        
        onStatusChange();
        setIsUpdating(false);
        return;
      }
      
      // For real data, update in Supabase
      const { error } = await supabase
        .from('staff')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', staff.id);
      
      if (error) {
        console.error('Error updating status:', error);
        throw error;
      }
      
      toast({
        title: 'Status Updated',
        description: `${staff.name} is now ${newStatus}`,
      });
      
      onStatusChange();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update staff status.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
      <Badge 
        variant="outline"
        className={`${
          staff.status === 'active' 
            ? 'bg-green-100 text-green-800 hover:bg-green-100' 
            : 'bg-slate-100 text-slate-800 hover:bg-slate-100'
        } cursor-default`}
      >
        {staff.status === 'active' ? 'Active' : 'Inactive'}
      </Badge>
      
      <Switch 
        checked={staff.status === 'active'} 
        onClick={handleStatusToggle}
        disabled={isUpdating}
      />
    </div>
  );
};

export default StaffStatusBadge;
