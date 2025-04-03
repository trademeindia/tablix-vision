
import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StaffMember } from '@/types/staff';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Mail, Phone, UserCog, PhoneCall } from 'lucide-react';
import RoleIcon from './RoleIcon';
import { format } from 'date-fns';
import { StaffStatusBadge } from './StaffStatusBadge';

interface StaffDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember;
}

const StaffDetailsDialog: React.FC<StaffDetailsDialogProps> = ({ open, onOpenChange, staff }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Staff Details</DialogTitle>
          <DialogDescription>
            View detailed information about this staff member.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center mb-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={staff.avatar_url || ''} alt={staff.name} />
            <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-lg font-semibold mt-2">{staff.name}</div>
          <div className="text-sm text-muted-foreground">
            <RoleIcon role={staff.role} />
            {staff.role}
          </div>
          <StaffStatusBadge status={staff.status} />
        </div>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-4 gap-2">
            <div className="text-sm font-medium col-span-1">Email:</div>
            <div className="text-sm col-span-3 flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              {staff.email}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <div className="text-sm font-medium col-span-1">Phone:</div>
            <div className="text-sm col-span-3 flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              {staff.phone}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <div className="text-sm font-medium col-span-1">Role:</div>
            <div className="text-sm col-span-3 flex items-center">
              <UserCog className="h-4 w-4 mr-2" />
              {staff.role}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <div className="text-sm font-medium col-span-1">Hire Date:</div>
            <div className="text-sm col-span-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {staff.hire_date ? format(new Date(staff.hire_date), 'PPP') : 'N/A'}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <div className="text-sm font-medium col-span-1">Salary:</div>
            <div className="text-sm col-span-3">
              {staff.salary ? `$${staff.salary}` : 'N/A'}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <div className="text-sm font-medium col-span-1">Department:</div>
            <div className="text-sm col-span-3">
              {staff.department || 'N/A'}
            </div>
          </div>

          {staff.emergency_contact && (
            <div className="grid grid-cols-4 gap-2">
              <div className="text-sm font-medium col-span-1">Emergency:</div>
              <div className="text-sm col-span-3 flex items-center">
                <PhoneCall className="h-4 w-4 mr-2" />
                {staff.emergency_contact}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailsDialog;
