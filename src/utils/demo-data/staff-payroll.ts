
import { StaffPayrollSummary } from '@/types/staff';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate random payroll data for staff members
 */
export const generateStaffPayroll = (count: number) => {
  const payrollRecords: StaffPayrollSummary[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate a random date within the last month for last payment
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setMonth(now.getMonth() - 1);
    const randomTimestamp = pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime());
    const lastPaymentDate = new Date(randomTimestamp).toISOString();
    
    // Generate random amounts between $2000-$5000 for total paid
    const totalPaid = Math.floor(Math.random() * 3000) + 2000;
    
    // Generate random amounts between $0-$1000 for pending
    const pendingAmount = Math.floor(Math.random() * 1000);
    
    payrollRecords.push({
      totalPaid,
      pendingAmount,
      lastPaymentDate
    });
  }
  
  return payrollRecords;
};
