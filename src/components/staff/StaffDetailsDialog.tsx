
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StaffMember } from '@/types/staff';
import { AlertCircle, BriefcaseBusiness, Calendar, Clock, Mail, Phone, User2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RoleIcon } from './RoleIcon';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface StaffDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember;
}

const StaffDetailsDialog: React.FC<StaffDetailsDialogProps> = ({ open, onOpenChange, staff }) => {
  // Format the created_at date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Format the last login time if available
  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      console.error('Error formatting last login date:', error);
      return 'Invalid date';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={staff.avatar_url || staff.avatar || staff.image || ''} alt={staff.name} />
              <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{staff.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Staff Role & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <RoleIcon role={staff.role} size={20} />
              <span className="font-medium">{staff.role}</span>
            </div>
            <Badge variant={staff.status === 'active' ? 'default' : 'secondary'} className="w-fit">
              {staff.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <Separator />

          {/* Personal Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{staff.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{staff.phone}</span>
              </div>
              
              {staff.department && (
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{staff.department}</span>
                </div>
              )}
              
              {staff.salary && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">${staff.salary.toFixed(2)}/month</span>
                </div>
              )}
              
              {staff.hire_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Hired: {formatDate(staff.hire_date)}</span>
                </div>
              )}
              
              {/* Emergency contact information */}
              {/* Note: This field is not in the database, but kept in the form for UI display only */}
              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Emergency: N/A</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* System Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">System Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Created: {formatDate(staff.created_at)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Last Login: {formatLastLogin(staff.last_login)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailsDialog;
