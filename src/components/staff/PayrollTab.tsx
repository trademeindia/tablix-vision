
import React, { useState, useEffect } from 'react';
import { StaffPayrollRecord, StaffPayrollSummary } from '@/types/staff';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PayrollTabProps {
  staffId: string;
}

const PayrollTab: React.FC<PayrollTabProps> = ({ staffId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [payrollRecords, setPayrollRecords] = useState<StaffPayrollRecord[]>([]);
  const [summary, setSummary] = useState<StaffPayrollSummary>({
    totalPaid: 0,
    pendingAmount: 0,
    lastPaymentDate: null
  });
  
  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        // In a real app, you would fetch from your database
        // For the demo, we'll simulate loading and generate fake data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate fake payroll records
        const records: StaffPayrollRecord[] = [];
        let totalPaid = 0;
        let pendingAmount = 0;
        let lastPaymentDate: string | null = null;
        
        // Current month and last 5 months
        for (let i = 0; i < 6; i++) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          
          const baseSalary = 3000 + Math.floor(Math.random() * 1000);
          const bonus = Math.floor(Math.random() * 500);
          const deductions = Math.floor(Math.random() * 300);
          const netSalary = baseSalary + bonus - deductions;
          
          // Determine if paid based on month (current month is pending)
          const isPaid = i > 0;
          const status = isPaid ? 'paid' : 'pending';
          
          // Format month for period
          const period = format(date, 'MMMM yyyy');
          
          // Set payment date if paid
          let paymentDate = '';
          if (isPaid) {
            const payDay = new Date(date);
            payDay.setDate(25); // Assuming payment on 25th
            paymentDate = format(payDay, 'yyyy-MM-dd');
            
            if (!lastPaymentDate) {
              lastPaymentDate = paymentDate;
            }
            
            totalPaid += netSalary;
          } else {
            pendingAmount += netSalary;
          }
          
          records.push({
            id: `pay-${i}`,
            period,
            base_salary: baseSalary,
            bonus,
            deductions,
            net_salary: netSalary,
            payment_date: isPaid ? paymentDate : '',
            status: status as 'paid' | 'pending'
          });
        }
        
        setPayrollRecords(records);
        setSummary({
          totalPaid,
          pendingAmount,
          lastPaymentDate
        });
      } catch (error) {
        console.error("Error fetching payroll data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPayroll();
  }, [staffId]);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PayrollSummaryCard 
          title="Total Paid (YTD)" 
          amount={summary.totalPaid}
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
        />
        <PayrollSummaryCard 
          title="Pending" 
          amount={summary.pendingAmount}
          icon={<DollarSign className="h-6 w-6 text-amber-500" />}
        />
        <PayrollSummaryCard 
          title="Last Payment" 
          value={summary.lastPaymentDate ? format(new Date(summary.lastPaymentDate), 'MMM dd, yyyy') : 'No payments yet'}
          icon={<DollarSign className="h-6 w-6 text-blue-500" />}
        />
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Base Salary</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.period}</TableCell>
                  <TableCell>${record.base_salary.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600">${record.bonus.toLocaleString()}</TableCell>
                  <TableCell className="text-red-600">-${record.deductions.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">${record.net_salary.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={record.status === 'paid' ? 'success' : 'outline'}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record.payment_date ? format(new Date(record.payment_date), 'MMM dd, yyyy') : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

interface PayrollSummaryCardProps {
  title: string;
  amount?: number;
  value?: string;
  icon: React.ReactNode;
}

const PayrollSummaryCard: React.FC<PayrollSummaryCardProps> = ({ 
  title, 
  amount, 
  value,
  icon 
}) => {
  const displayValue = amount !== undefined ? `$${amount.toLocaleString()}` : value;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-500">{title}</h3>
            <div className="mt-2 text-2xl font-bold">{displayValue}</div>
          </div>
          <div className="p-3 bg-slate-100 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollTab;
