
import { v4 as uuidv4 } from 'uuid';
import { StaffMember } from '@/types/staff';
import { addDays, subDays, format } from 'date-fns';

// Helper function to generate a random date within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper to generate avatar URLs
const generateAvatarUrl = (name: string) => {
  const encodedName = encodeURIComponent(name);
  const url = `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=256`;
  console.log(`Generated avatar URL for ${name}: ${url}`);
  return url;
};

// Generate demo staff data
export const generateDemoStaffData = (count: number = 10): StaffMember[] => {
  const roles = ['Waiter', 'Chef', 'Manager', 'Receptionist'];
  const statuses = ['active', 'inactive'];
  const departments = ['Front of House', 'Kitchen', 'Administration', 'Bar'];
  
  const now = new Date();
  const oneYearAgo = subDays(now, 365);
  
  const firstNames = ['John', 'Emma', 'James', 'Olivia', 'Matthew', 'Sophia', 'William', 'Emily', 'Alexander', 'Harper', 'Charlotte'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Thomas', 'Perez'];
  
  return Array.from({ length: count }).map((_, index) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    
    // Generate avatar URL
    const avatarUrl = generateAvatarUrl(fullName);
    
    // Generate a unique staff ID with a prefix for easy identification
    const id = `staff-${uuidv4().slice(0, 8)}`;
    
    return {
      id,
      restaurant_id: 'demo-restaurant',
      name: fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+1${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)] as 'active' | 'inactive',
      salary: Math.floor(Math.random() * 50000) + 30000,
      department: departments[Math.floor(Math.random() * departments.length)],
      hire_date: format(randomDate(oneYearAgo, now), 'yyyy-MM-dd'),
      last_login: Math.random() > 0.3 ? format(randomDate(subDays(now, 30), now), 'yyyy-MM-dd HH:mm:ss') : undefined,
      emergency_contact: `+1${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`,
      avatar_url: avatarUrl,
      avatar: avatarUrl,
      image: avatarUrl,
      created_at: format(randomDate(oneYearAgo, now), 'yyyy-MM-dd HH:mm:ss'),
      updated_at: format(randomDate(oneYearAgo, now), 'yyyy-MM-dd HH:mm:ss'),
    };
  });
};
