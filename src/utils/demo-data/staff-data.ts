
import { StaffMember } from '@/types/staff';
import { v4 as uuidv4 } from 'uuid';

// Random avatar image URLs from public unsplash collections
// These are stable URLs that should be reliable for demos
const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=200&h=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=200&h=200',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?fit=crop&w=200&h=200',
  'https://images.unsplash.com/photo-1569913486515-b74bf7751574?fit=crop&w=200&h=200',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?fit=crop&w=200&h=200',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=200&h=200',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?fit=crop&w=200&h=200',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=crop&w=200&h=200',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?fit=crop&w=200&h=200',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?fit=crop&w=200&h=200',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?fit=crop&w=200&h=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=200&h=200',
];

const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Susan', 'Richard', 'Jessica', 'Joseph', 'Sarah',
  'Thomas', 'Karen', 'Charles', 'Nancy', 'Sophia', 'Emma', 'Olivia', 'Ava',
  'Isabella', 'Mia', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young'
];

const ROLES = ['Waiter', 'Chef', 'Manager', 'Receptionist'];

const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const getRandomName = () => {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${lastName}`;
};

const getRandomPhone = () => {
  return `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
};

const getRandomEmail = (name: string) => {
  const domain = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'][Math.floor(Math.random() * 5)];
  return `${name.toLowerCase().replace(' ', '.')}@${domain}`;
};

const getRandomRole = () => {
  return ROLES[Math.floor(Math.random() * ROLES.length)];
};

export const generateDemoStaffData = (count: number = 10): StaffMember[] => {
  console.log(`Generating ${count} demo staff records with avatar URLs`);
  
  const now = new Date();
  const yearAgo = new Date(now);
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  
  const staffData: StaffMember[] = [];
  
  for (let i = 0; i < count; i++) {
    const name = getRandomName();
    const avatarUrl = AVATAR_URLS[i % AVATAR_URLS.length]; // Cycle through available avatars
    
    // Log each avatar URL for debugging
    console.log(`Demo staff ${name} avatar URL:`, avatarUrl);
    
    staffData.push({
      id: uuidv4(),
      restaurant_id: '123e4567-e89b-12d3-a456-426614174000',
      name,
      phone: getRandomPhone(),
      email: getRandomEmail(name),
      role: getRandomRole() as any,
      status: Math.random() > 0.2 ? 'active' : 'inactive',
      last_login: Math.random() > 0.3 ? getRandomDate(yearAgo, now) : undefined,
      created_at: getRandomDate(yearAgo, now),
      updated_at: getRandomDate(yearAgo, now),
      salary: Math.floor(Math.random() * 50000) + 30000,
      hire_date: getRandomDate(yearAgo, now),
      department: ['Front of House', 'Kitchen', 'Management', 'Reception'][Math.floor(Math.random() * 4)],
      emergency_contact: Math.random() > 0.5 ? `${getRandomName()} - ${getRandomPhone()}` : undefined,
      avatar_url: avatarUrl, // Use the selected avatar URL
      avatar: avatarUrl, // For backward compatibility
      image: avatarUrl, // For further compatibility
    });
  }
  
  return staffData;
};

// New function to generate staff attendance records
export const generateStaffAttendance = (staffId: string, days: number = 30) => {
  const records = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Skip weekends
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    // Determine status with realistic probabilities
    let status = 'present';
    if (Math.random() < 0.05) status = 'absent';
    else if (Math.random() < 0.1) status = 'late';
    
    let checkIn = null;
    let checkOut = null;
    let notes = null;
    
    if (status !== 'absent') {
      // Generate check-in time (8:45 AM to 9:15 AM)
      const checkInHour = 8 + (status === 'late' ? 1 : 0);
      const checkInMin = Math.floor(Math.random() * 30) + (status === 'late' ? 15 : 45);
      checkIn = `${checkInHour.toString().padStart(2, '0')}:${checkInMin.toString().padStart(2, '0')}`;
      
      // Generate check-out time (4:45 PM to 6:15 PM)
      const checkOutHour = 16 + Math.floor(Math.random() * 2);
      const checkOutMin = Math.floor(Math.random() * 30) + 45;
      checkOut = `${checkOutHour.toString().padStart(2, '0')}:${checkOutMin.toString().padStart(2, '0')}`;
      
      if (status === 'late') {
        notes = ['Traffic delay', 'Public transport issues', 'Personal emergency'][Math.floor(Math.random() * 3)];
      }
    } else {
      notes = ['Sick leave', 'Personal leave', 'Family emergency'][Math.floor(Math.random() * 3)];
    }
    
    records.push({
      id: uuidv4(),
      staff_id: staffId,
      date: dateStr,
      status,
      check_in: checkIn,
      check_out: checkOut,
      notes
    });
  }
  
  // Sort by date (most recent first)
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// New function to generate staff payroll records
export const generateStaffPayroll = (staffId: string, months: number = 6) => {
  const records = [];
  const now = new Date();
  
  for (let i = 0; i < months; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    
    // Set to the 1st of the month
    date.setDate(1);
    const startDate = new Date(date);
    
    // Set to the last day of the month
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    const endDate = new Date(date);
    
    const periodStart = startDate.toISOString().split('T')[0];
    const periodEnd = endDate.toISOString().split('T')[0];
    
    // Calculate period name (e.g., "January 2023")
    const periodName = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Base salary between $3000 and $5000
    const baseSalary = Math.floor(Math.random() * 2000) + 3000;
    
    // Bonus between $0 and $1000
    const bonus = Math.floor(Math.random() * 1000);
    
    // Deductions between $500 and $1200
    const deductions = Math.floor(Math.random() * 700) + 500;
    
    // Net salary
    const netSalary = baseSalary + bonus - deductions;
    
    // Payment date (usually around 5th of next month)
    const paymentDate = new Date(endDate);
    paymentDate.setDate(5);
    paymentDate.setMonth(paymentDate.getMonth() + 1);
    
    // Status - older ones are paid, current month might be pending
    const status = i === 0 ? (Math.random() > 0.5 ? 'paid' : 'pending') : 'paid';
    
    records.push({
      id: uuidv4(),
      staff_id: staffId,
      period: periodName,
      period_start: periodStart,
      period_end: periodEnd,
      base_salary: baseSalary,
      bonus,
      deductions,
      net_salary: netSalary,
      payment_date: paymentDate.toISOString(),
      status,
      notes: status === 'pending' ? 'Awaiting approval' : null
    });
  }
  
  // Sort by date (most recent first)
  return records.sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());
};

// New function to generate staff shifts
export const generateStaffShifts = (staffId: string, days: number = 21) => {
  const shifts = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set to start of today
  
  // Positions based on restaurant roles
  const positions = {
    'Waiter': ['Floor Server', 'Bar Service', 'Host'],
    'Chef': ['Line Cook', 'Prep Chef', 'Head Chef', 'Pastry Chef'],
    'Manager': ['Floor Manager', 'Shift Supervisor', 'General Manager'],
    'Receptionist': ['Front Desk', 'Reservations', 'Customer Service']
  };
  
  // Shift patterns
  const shiftPatterns = [
    { start: '07:00', end: '15:00', name: 'Morning' },
    { start: '11:00', end: '19:00', name: 'Afternoon' },
    { start: '15:00', end: '23:00', name: 'Evening' },
    { start: '18:00', end: '02:00', name: 'Night' }
  ];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i - 10); // Start from 10 days ago
    const dateStr = date.toISOString().split('T')[0];
    
    // Skip some days randomly to create a realistic schedule
    if (Math.random() < 0.3) continue;
    
    // Randomly select a position category
    const roleCategory = Object.keys(positions)[Math.floor(Math.random() * Object.keys(positions).length)];
    const positionOptions = positions[roleCategory as keyof typeof positions];
    const position = positionOptions[Math.floor(Math.random() * positionOptions.length)];
    
    // Randomly select a shift pattern
    const shift = shiftPatterns[Math.floor(Math.random() * shiftPatterns.length)];
    
    // Determine if this is a past shift (completed) or future shift (scheduled)
    const isPastShift = date < now;
    
    shifts.push({
      id: uuidv4(),
      staff_id: staffId,
      date: dateStr,
      start_time: shift.start,
      end_time: shift.end,
      position,
      status: isPastShift ? 'completed' : 'scheduled',
      notes: isPastShift && Math.random() < 0.2 ? 'Overtime: +1 hour' : null
    });
  }
  
  // Sort by date (most recent first)
  return shifts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

