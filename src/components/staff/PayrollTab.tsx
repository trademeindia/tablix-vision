
import React from 'react';
import { usePayrollData } from '@/hooks/use-payroll-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { DollarSign, Calendar, AlertCircle } from 'lucide-react';

interface PayrollTabProps {
  staffId: string;
}

const PayrollTab: React.FC<PayrollTabProps> = ({ staffId }) => {
  const { payrollData, payrollSummary, isLoading } = usePayrollData(staffId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="w-4 h-4 mr-1 text-green-600" />
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(payrollSummary.totalPaid)}</div>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertCircle className="w-4 h-4 mr-1 text-amber-600" />
              Pending Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(payrollSummary.pendingAmount)}</div>
            <p className="text-xs text-muted-foreground">Current period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-blue-600" />
              Last Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payrollSummary.lastPaymentDate ? format(parseISO(payrollSummary.lastPaymentDate), 'MMM dd, yyyy') : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Regular monthly payment</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payroll History</CardTitle>
          <CardDescription>Last 6 months of payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Base Salary</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.period}</TableCell>
                  <TableCell>{formatCurrency(record.base_salary)}</TableCell>
                  <TableCell>{formatCurrency(record.bonus)}</TableCell>
                  <TableCell className="text-red-600">-{formatCurrency(record.deductions)}</TableCell>
                  <TableCell className="font-bold">{formatCurrency(record.net_salary)}</TableCell>
                  <TableCell>{format(parseISO(record.payment_date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={record.status === 'paid' ? "outline" : "secondary"} className={record.status === 'paid' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-amber-100 text-amber-800 hover:bg-amber-100'}>
                      {record.status === 'paid' ? 'Paid' : 'Pending'}
                    </Badge>
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

export default PayrollTab;
