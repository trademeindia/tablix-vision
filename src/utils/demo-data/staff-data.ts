
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
