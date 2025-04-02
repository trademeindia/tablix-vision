
import React from 'react';
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
  const { toast } = useToast();

  const handleStatusChange = async (checked: boolean) => {
    try {
      const status = checked ? 'active' : 'inactive';
      const { error } = await supabase
        .from('staff' as any)
        .update({ status })
        .eq('id', staff.id);
        
      if (error) throw error;
      
      toast({
        title: 'Status Updated',
        description: `${staff.name} is now ${status}`,
      });
      
      onStatusChange();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update staff status',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        checked={staff.status === 'active'} 
        onCheckedChange={handleStatusChange}
      />
      <Badge 
        variant={staff.status === 'active' ? "default" : "secondary"}
        className={staff.status === 'active' ? "bg-green-500" : "bg-slate-400"}
      >
        {staff.status === 'active' ? 'Active' : 'Inactive'}
      </Badge>
    </div>
  );
};

export default StaffStatusBadge;
