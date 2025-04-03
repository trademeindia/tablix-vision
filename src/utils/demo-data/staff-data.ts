
import { StaffMember, StaffRole } from '@/types/staff';

// Staff profile images
const staffImages = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
];

// Function to generate a random date within the last year
const getRandomDate = (daysAgo = 365) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Generate demo staff data
export const generateDemoStaffData = (count = 10): StaffMember[] => {
  const roles: StaffRole[] = ['Waiter', 'Chef', 'Manager', 'Receptionist'];
  const statuses: ('active' | 'inactive')[] = ['active', 'inactive'];
  
  return Array.from({ length: count }).map((_, index) => {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const status = Math.random() > 0.2 ? 'active' : 'inactive'; // 80% active
    
    return {
      id: `staff-${index + 1}`,
      restaurant_id: 'demo-restaurant',
      user_id: `user-${index + 1}`,
      name: [
        'Olivia Martinez', 'Liam Johnson', 'Emma Wilson', 'Noah Smith',
        'Ava Brown', 'Sophia Garcia', 'Isabella Rodriguez', 'Charlotte Lopez',
        'Mia Lee', 'Amelia Gonzalez', 'Harper Perez', 'Evelyn Sanchez',
        'Michael Davis', 'James Chen', 'Robert Kim', 'David Patel'
      ][index % 16],
      phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: [`olivia@restaurant.com`, `liam@restaurant.com`, `emma@restaurant.com`, 
              `noah@restaurant.com`, `ava@restaurant.com`, `sophia@restaurant.com`, 
              `isabella@restaurant.com`, `charlotte@restaurant.com`, `mia@restaurant.com`,
              `amelia@restaurant.com`, `harper@restaurant.com`, `evelyn@restaurant.com`,
              `michael@restaurant.com`, `james@restaurant.com`, `robert@restaurant.com`,
              `david@restaurant.com`][index % 16],
      role: role,
      status: status,
      avatar: staffImages[index % staffImages.length],
      last_login: getRandomDate(30),
      created_at: getRandomDate(365),
      updated_at: getRandomDate(60),
      salary: 2500 + Math.floor(Math.random() * 3500),
      hire_date: getRandomDate(730), // Within last 2 years
      department: role === 'Chef' ? 'Kitchen' : role === 'Waiter' ? 'Service' : 'Management',
      manager_id: role !== 'Manager' ? 'staff-1' : undefined,
      emergency_contact: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    };
  });
};

// Generate attendance data for a staff member
export const generateStaffAttendance = (staffId: string, days = 30) => {
  return Array.from({ length: days }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    
    // Random attendance status (present, absent, late)
    const status = Math.random() > 0.8 
      ? Math.random() > 0.5 ? 'absent' : 'late' 
      : 'present';
    
    // Generate reasonable check-in/out times
    const checkInHour = status === 'late' ? 9 + Math.floor(Math.random() * 2) : 8;
    const checkInMinute = Math.floor(Math.random() * 60);
    
    const checkOutHour = 17 + Math.floor(Math.random() * 2);
    const checkOutMinute = Math.floor(Math.random() * 60);
    
    return {
      id: `attendance-${staffId}-${index}`,
      staff_id: staffId,
      date: date.toISOString().split('T')[0],
      status,
      check_in: status !== 'absent' ? `${checkInHour}:${checkInMinute.toString().padStart(2, '0')}` : null,
      check_out: status !== 'absent' ? `${checkOutHour}:${checkOutMinute.toString().padStart(2, '0')}` : null,
      notes: status === 'absent' ? 'Called in sick' : status === 'late' ? 'Traffic delay' : '',
    };
  });
};

// Generate payroll data for a staff member
export const generateStaffPayroll = (staffId: string, months = 6) => {
  return Array.from({ length: months }).map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - index);
    
    const baseSalary = 2500 + Math.floor(Math.random() * 1500);
    const bonus = Math.random() > 0.7 ? Math.floor(Math.random() * 500) : 0;
    const deductions = Math.floor(Math.random() * 300);
    
    return {
      id: `payroll-${staffId}-${index}`,
      staff_id: staffId,
      period: `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`,
      base_salary: baseSalary,
      bonus,
      overtime: Math.floor(Math.random() * 200),
      deductions,
      net_salary: baseSalary + bonus - deductions,
      payment_date: new Date(date.getFullYear(), date.getMonth(), 28).toISOString().split('T')[0],
      status: index === 0 ? 'pending' : 'paid',
    };
  });
};

// Generate shifts data for a staff member
export const generateStaffShifts = (staffId: string, days = 14) => {
  const shifts = [];
  const date = new Date();
  
  // Set to beginning of current week
  date.setDate(date.getDate() - date.getDay());
  
  for (let i = 0; i < days; i++) {
    // Generate between 0-2 shifts per day (more on weekends)
    const shiftsPerDay = date.getDay() === 0 || date.getDay() === 6 
      ? Math.floor(Math.random() * 2) + 1 
      : Math.floor(Math.random() * 2);
    
    for (let j = 0; j < shiftsPerDay; j++) {
      const isLunch = j === 0;
      const startHour = isLunch ? 11 : 17;
      const endHour = isLunch ? 15 : 23;
      
      shifts.push({
        id: `shift-${staffId}-${i}-${j}`,
        staff_id: staffId,
        date: new Date(date).toISOString().split('T')[0],
        start_time: `${startHour}:00`,
        end_time: `${endHour}:00`,
        position: Math.random() > 0.5 ? 'Server' : 'Host',
        notes: '',
        status: date < new Date() ? 'completed' : 'scheduled',
      });
    }
    
    // Move to next day
    date.setDate(date.getDate() + 1);
  }
  
  return shifts;
};
