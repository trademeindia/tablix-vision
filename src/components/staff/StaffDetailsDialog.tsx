
import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StaffMember } from '@/types/staff';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChefHat, UserCog, User, HelpCircle, Phone, Mail, Calendar, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AttendanceTab from './AttendanceTab';
import PayrollTab from './PayrollTab';
import ShiftsTab from './ShiftsTab';

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
  const [activeTab, setActiveTab] = useState('info');

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'chef':
        return <ChefHat className="h-4 w-4 mr-1 text-amber-500" />;
      case 'manager':
        return <UserCog className="h-4 w-4 mr-1 text-blue-500" />;
      case 'waiter':
        return <User className="h-4 w-4 mr-1 text-green-500" />;
      default:
        return <HelpCircle className="h-4 w-4 mr-1 text-gray-500" />;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Staff Details</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="info">Profile</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="shifts">Shifts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={staff?.avatar_url || staff?.image} alt={staff?.name} />
                  <AvatarFallback>{getInitials(staff?.name || '')}</AvatarFallback>
                </Avatar>
                
                <div className="space-y-1 flex-1">
                  <h3 className="text-xl font-semibold flex items-center">
                    {staff.name}
                    <Badge 
                      variant={staff.status === 'active' ? "default" : "secondary"}
                      className={`ml-2 ${staff.status === 'active' ? "bg-green-500" : "bg-slate-400"}`}
                    >
                      {staff.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </h3>
                  <p className="text-sm text-slate-500 flex items-center">
                    {getRoleIcon(staff.role)} {staff.role}
                  </p>
                  {staff.department && (
                    <p className="text-sm text-slate-500">Department: {staff.department}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Contact Information</h4>
                  <div className="text-sm space-y-2">
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-slate-400" />
                      <span className="text-slate-500">Phone:</span> 
                      <span className="ml-1 font-medium">{staff.phone}</span>
                    </p>
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-slate-400" />
                      <span className="text-slate-500">Email:</span> 
                      <span className="ml-1 font-medium">{staff.email}</span>
                    </p>
                    {staff.emergency_contact && (
                      <p className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-red-400" />
                        <span className="text-slate-500">Emergency:</span> 
                        <span className="ml-1 font-medium">{staff.emergency_contact}</span>
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Employment Information</h4>
                  <div className="text-sm space-y-2">
                    {staff.hire_date && (
                      <p className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="text-slate-500">Hire Date:</span> 
                        <span className="ml-1 font-medium">{formatDate(staff.hire_date)}</span>
                      </p>
                    )}
                    {staff.salary && (
                      <p className="flex items-center">
                        <span className="h-4 w-4 mr-2 text-slate-400 font-bold">$</span>
                        <span className="text-slate-500">Salary:</span> 
                        <span className="ml-1 font-medium">
                          ${staff.salary.toLocaleString('en-US')} per year
                        </span>
                      </p>
                    )}
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-slate-400" />
                      <span className="text-slate-500">Last Login:</span> 
                      <span className="ml-1 font-medium">{formatDate(staff.last_login)}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 space-y-3">
                <h4 className="text-sm font-medium">System Information</h4>
                <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <p><span className="text-slate-500">Created:</span> {formatDate(staff.created_at)}</p>
                  <p><span className="text-slate-500">Updated:</span> {formatDate(staff.updated_at)}</p>
                  <p><span className="text-slate-500">Staff ID:</span> {staff.id}</p>
                  {staff.user_id && (
                    <p><span className="text-slate-500">User ID:</span> {staff.user_id}</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="attendance">
            <AttendanceTab staffId={staff.id} />
          </TabsContent>
          
          <TabsContent value="payroll">
            <PayrollTab staffId={staff.id} />
          </TabsContent>
          
          <TabsContent value="shifts">
            <ShiftsTab staffId={staff.id} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
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
