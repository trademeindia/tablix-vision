
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { StaffMember } from '@/types/staff';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ToggleRight, ToggleLeft } from 'lucide-react';

interface StaffStatusBadgeProps {
  staff: StaffMember;
  onStatusChange: () => void;
}

const StaffStatusBadge: React.FC<StaffStatusBadgeProps> = ({ staff, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isActive, setIsActive] = useState(staff.status === 'active');
  const { toast } = useToast();
  
  // Update local state when staff prop changes
  useEffect(() => {
    setIsActive(staff.status === 'active');
  }, [staff.status]);
  
  const handleStatusToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      const newStatus = isActive ? 'inactive' : 'active';
      
      console.log(`Updating status for staff ID ${staff.id} to ${newStatus}`);
      
      // If using demo data (IDs starting with 'staff-'), simulate update
      if (staff.id.startsWith('staff-')) {
        // Wait a moment to simulate server processing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setIsActive(!isActive);
        
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
      
      // Only update local state after successful update to database
      setIsActive(!isActive);
      
      toast({
        title: 'Status Updated',
        description: `${staff.name} is now ${newStatus}`,
      });
      
      // Notify parent component to refresh data
      onStatusChange();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update staff status. Please try again.',
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
          isActive 
            ? 'bg-green-100 text-green-800 hover:bg-green-100' 
            : 'bg-slate-100 text-slate-800 hover:bg-slate-100'
        } font-medium cursor-default transition-colors`}
      >
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
      
      <button 
        onClick={handleStatusToggle}
        disabled={isUpdating}
        className={`flex items-center justify-center ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label={isActive ? "Set staff inactive" : "Set staff active"}
      >
        {isActive ? (
          <ToggleRight className="h-5 w-5 text-green-600" />
        ) : (
          <ToggleLeft className="h-5 w-5 text-slate-500" />
        )}
      </button>
    </div>
  );
};

export default StaffStatusBadge;
