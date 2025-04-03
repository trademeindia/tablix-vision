
import { StaffMember } from '@/types/staff';
import { v4 as uuidv4 } from 'uuid';

// Sample role options
const roles = ['Waiter', 'Chef', 'Manager', 'Receptionist'];

// Sample department options
const departments = ['Kitchen', 'Front of House', 'Administration', 'Bar'];

// Sample status options
const statuses = ['active', 'inactive'];

// Sample avatar URLs from UI Avatars API
const generateAvatarUrl = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
};

// Function to generate a random date within the last 2 years
const generateRandomDate = (yearsBack = 2) => {
  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setFullYear(now.getFullYear() - yearsBack);
  
  const randomTimestamp = pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime());
  return new Date(randomTimestamp).toISOString();
};

// Function to generate random staff data
export const generateDemoStaffData = (count: number): StaffMember[] => {
  const staffList: StaffMember[] = [];
  
  const firstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 
    'James', 'Emma', 'Robert', 'Olivia', 'William', 'Sophia',
    'Richard', 'Ava', 'Joseph', 'Mia', 'Thomas', 'Isabella',
    'Charles', 'Charlotte', 'Daniel', 'Amelia', 'Matthew', 'Harper'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Garcia',
    'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez',
    'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson',
    'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris'
  ];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const role = roles[Math.floor(Math.random() * roles.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const avatarUrl = generateAvatarUrl(name);
    const hireDate = generateRandomDate();
    const createdAt = generateRandomDate();
    
    // Generate a phone number in the format +1 XXX-XXX-XXXX
    const phone = `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    
    // Generate a random salary between $2000 and $6000
    const salary = Math.floor(Math.random() * 4000) + 2000;
    
    // Maybe have last login date for some staff
    const lastLogin = Math.random() > 0.3 ? generateRandomDate(0.1) : undefined;
    
    staffList.push({
      id: uuidv4(),
      name,
      email,
      phone,
      role,
      status: status as 'active' | 'inactive',
      department,
      salary,
      hire_date: hireDate,
      avatar_url: avatarUrl,
      avatar: avatarUrl,
      image: avatarUrl,
      created_at: createdAt,
      updated_at: new Date().toISOString(),
      last_login: lastLogin,
      restaurant_id: uuidv4(),
      // emergency_contact field is removed from StaffMember type
    });
  }
  
  return staffList;
};
