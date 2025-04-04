
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StaffMember } from '@/types/staff';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import RoleIcon from './RoleIcon';
import { Mail, Phone, Clock, Building, FileText, User } from 'lucide-react';
import ShiftsTab from './ShiftsTab';
import AttendanceTab from './AttendanceTab';
import PayrollTab from './PayrollTab';

interface StaffDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember | null;
}

const StaffDetailsDialog: React.FC<StaffDetailsDialogProps> = ({
  open,
  onOpenChange,
  staff,
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  
  if (!staff) return null;
  
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Choose the most reliable image source
  const staffImage = staff.avatar_url || staff.avatar || staff.image;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Staff Details</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32 border-4 border-slate-100 shadow-lg mb-3">
                <AvatarImage 
                  src={staffImage} 
                  alt={staff.name} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 text-3xl font-semibold">
                  {getInitials(staff.name)}
                </AvatarFallback>
              </Avatar>
              
              <Badge 
                variant={staff.status === 'active' ? 'success' : 'secondary'}
                className="mt-2 px-3 py-1 text-sm"
              >
                {staff.status.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex-1 flex flex-col items-center md:items-start">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">{staff.name}</h2>
              
              <div className="flex items-center mt-1">
                <RoleIcon role={staff.role || ''} className="h-5 w-5 mr-2" />
                <span className="text-lg font-medium text-slate-600 capitalize">{staff.role}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mt-4 w-full">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-slate-400 mr-2" />
                  <span className="text-slate-600">{staff.email || 'No email provided'}</span>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-slate-400 mr-2" />
                  <span className="text-slate-600">{staff.phone || 'No phone provided'}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-slate-400 mr-2" />
                  <span className="text-slate-600">Hired: {formatDate(staff.hire_date)}</span>
                </div>
                
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-slate-400 mr-2" />
                  <span className="text-slate-600">Dept: {staff.department || 'Unassigned'}</span>
                </div>
                
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-slate-400 mr-2" />
                  <span className="text-slate-600">
                    Salary: ${staff.salary?.toLocaleString() || 'Not specified'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <User className="h-4 w-4 text-slate-400 mr-2" />
                  <span className="text-slate-600">
                    ID: {staff.id.substring(0, 8)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3 mb-8">
                <TabsTrigger value="profile" className="text-sm">Profile</TabsTrigger>
                <TabsTrigger value="shifts" className="text-sm">Shifts</TabsTrigger>
                <TabsTrigger value="attendance" className="text-sm">Attendance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="text-md font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Email:</span> {staff.email}
                      </p>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Phone:</span> {staff.phone}
                      </p>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Emergency Contact:</span> {staff.emergency_contact || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="text-md font-semibold mb-2">Employment Details</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Department:</span> {staff.department || 'Unassigned'}
                      </p>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Hire Date:</span> {formatDate(staff.hire_date)}
                      </p>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Last Login:</span> {staff.last_login ? format(new Date(staff.last_login), 'MMM dd, yyyy HH:mm') : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <PayrollTab staffId={staff.id} />
              </TabsContent>
              
              <TabsContent value="shifts">
                <ShiftsTab staffId={staff.id} />
              </TabsContent>
              
              <TabsContent value="attendance">
                <AttendanceTab staffId={staff.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailsDialog;
