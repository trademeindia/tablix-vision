
import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  MailIcon, PhoneIcon, CalendarIcon, 
  CheckCircle2Icon, XCircleIcon, UserCogIcon 
} from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface StaffDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember;
}

const StaffDetailsDialog: React.FC<StaffDetailsDialogProps> = ({ 
  open, 
  onOpenChange, 
  staff 
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'PPpp');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Simulate permissions based on role
  const getPermissions = (role: string) => {
    switch (role.toLowerCase()) {
      case 'manager':
        return ['View Dashboard', 'Manage Staff', 'Manage Menu', 'View Reports', 'Manage Orders'];
      case 'chef':
        return ['View Kitchen Dashboard', 'Update Order Status', 'View Menu'];
      case 'waiter':
        return ['Take Orders', 'View Tables', 'Call Kitchen'];
      case 'receptionist':
        return ['Manage Reservations', 'View Tables', 'Customer Service'];
      default:
        return ['Basic Access'];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{staff.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge 
              variant={staff.status === 'active' ? "default" : "secondary"}
              className={staff.status === 'active' ? "bg-green-500" : "bg-slate-400"}
            >
              {staff.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
            <div>
              <Badge variant="outline" className="border-blue-300 text-blue-600">
                {staff.role}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <MailIcon className="h-4 w-4 mr-2 text-slate-500" />
              <span>{staff.email}</span>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="h-4 w-4 mr-2 text-slate-500" />
              <span>{staff.phone}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-slate-500" />
              <span>Last login: {formatDate(staff.last_login)}</span>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <UserCogIcon className="h-4 w-4 mr-2" />
              Permissions
            </h3>
            <div className="space-y-2">
              {getPermissions(staff.role).map((permission) => (
                <div key={permission} className="flex items-center text-sm">
                  <CheckCircle2Icon className="h-4 w-4 mr-2 text-green-500" />
                  {permission}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-md text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Created:</span>
              <span>{formatDate(staff.created_at)}</span>
            </div>
            {staff.updated_at && (
              <div className="flex justify-between mt-1">
                <span>Last Updated:</span>
                <span>{formatDate(staff.updated_at)}</span>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailsDialog;
