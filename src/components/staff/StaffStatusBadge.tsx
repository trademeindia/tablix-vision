
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
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  
  const handleToggleStatus = async (event: React.MouseEvent) => {
    event.stopPropagation();
    
    const newStatus = staff.status === 'active' ? 'inactive' : 'active';
    // console.log(`Changing status for ${staff.name} from ${staff.status} to ${newStatus}`);
    
    setUpdating(true);
    
    try {
      // Check if this is demo data
      if (staff.id.startsWith('staff-')) {
        // Simulate update for demo data
        await new Promise(resolve => setTimeout(resolve, 500));
        toast({
          title: 'Status Updated (Demo)',
          description: `${staff.name} is now ${newStatus} (Note: This is demo data)`,
        });
        onStatusChange();
        return;
      }
      
      // For real data, update in Supabase
      const { error } = await supabase
        .from('staff')
        .update({ status: newStatus })
        .eq('id', staff.id);
      
      if (error) {
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
        description: 'Failed to update staff status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };
  
  return (
    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
      <Badge 
        variant={staff.status === 'active' ? 'success' : 'secondary'}
        className={`
          text-xs font-medium capitalize px-2.5 py-0.5 transition-colors
          ${staff.status === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
            : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}
        `}
      >
        {staff.status}
      </Badge>
      
      <Switch 
        checked={staff.status === 'active'} 
        onCheckedChange={() => {}} 
        onClick={handleToggleStatus}
        disabled={updating}
        className="data-[state=checked]:bg-green-500 transition-colors"
      />
    </div>
  );
};

export default StaffStatusBadge;
