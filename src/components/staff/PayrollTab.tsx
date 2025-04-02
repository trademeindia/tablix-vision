
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { usePayrollData } from '@/hooks/use-payroll-data';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface PayrollTabProps {
  staffId?: string;
}

const PayrollTab: React.FC<PayrollTabProps> = ({ staffId }) => {
  const { payrollData, isLoading } = usePayrollData(staffId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-blue-500">Approved</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleDownloadPayslip = (payrollId: string) => {
    // In a real application, this would generate and download a PDF payslip
    console.log(`Downloading payslip for ID: ${payrollId}`);
    alert(`Payslip for ${payrollId} would be downloaded in a real application.`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payroll History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Base Salary</TableHead>
                  <TableHead>Overtime</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Bonuses</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No payroll records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  payrollData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {formatDate(record.period_start)} - {formatDate(record.period_end)}
                      </TableCell>
                      <TableCell>{formatCurrency(record.base_salary)}</TableCell>
                      <TableCell>
                        {record.overtime_hours} hrs ({formatCurrency(record.overtime_hours * record.overtime_rate)})
                      </TableCell>
                      <TableCell>{formatCurrency(record.deductions)}</TableCell>
                      <TableCell>{formatCurrency(record.bonuses)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(record.total_amount)}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>{formatDate(record.payment_date)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadPayslip(record.id)}
                          disabled={record.status !== 'paid'}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Payslip
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollTab;
