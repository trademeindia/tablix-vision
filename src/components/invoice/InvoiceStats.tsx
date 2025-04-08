
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Invoice } from '@/services/invoice/types';
import { formatCurrency } from '@/utils/format';
import { BadgeCheck, Clock, AlertCircle, BadgeX, Receipt, CircleDollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface InvoiceStatsProps {
  invoices: Invoice[];
  isLoading: boolean;
}

const InvoiceStats = ({ invoices, isLoading }: InvoiceStatsProps) => {
  const stats = useMemo(() => {
    if (!invoices.length) {
      return {
        total: 0,
        totalAmount: 0,
        paid: 0,
        paidAmount: 0,
        draft: 0,
        draftAmount: 0,
        issued: 0,
        issuedAmount: 0,
        cancelled: 0,
        cancelledAmount: 0
      };
    }

    return invoices.reduce(
      (acc, invoice) => {
        acc.total += 1;
        acc.totalAmount += invoice.final_amount;

        switch (invoice.status) {
          case 'paid':
            acc.paid += 1;
            acc.paidAmount += invoice.final_amount;
            break;
          case 'draft':
            acc.draft += 1;
            acc.draftAmount += invoice.final_amount;
            break;
          case 'issued':
            acc.issued += 1;
            acc.issuedAmount += invoice.final_amount;
            break;
          case 'cancelled':
            acc.cancelled += 1;
            acc.cancelledAmount += invoice.final_amount;
            break;
        }

        return acc;
      },
      {
        total: 0,
        totalAmount: 0,
        paid: 0,
        paidAmount: 0,
        draft: 0,
        draftAmount: 0,
        issued: 0,
        issuedAmount: 0,
        cancelled: 0,
        cancelledAmount: 0
      }
    );
  }, [invoices]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-16 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard 
        title="Total Invoices"
        value={stats.total.toString()}
        subValue={formatCurrency(stats.totalAmount)}
        icon={<Receipt className="h-5 w-5" />}
      />
      
      <StatCard 
        title="Paid"
        value={stats.paid.toString()}
        subValue={formatCurrency(stats.paidAmount)}
        icon={<BadgeCheck className="h-5 w-5 text-green-500" />}
      />
      
      <StatCard 
        title="Pending Payment"
        value={stats.issued.toString()}
        subValue={formatCurrency(stats.issuedAmount)}
        icon={<Clock className="h-5 w-5 text-amber-500" />}
      />
      
      <StatCard 
        title="Draft"
        value={stats.draft.toString()}
        subValue={formatCurrency(stats.draftAmount)}
        icon={<AlertCircle className="h-5 w-5 text-blue-500" />}
      />
      
      <StatCard 
        title="Cancelled"
        value={stats.cancelled.toString()}
        subValue={formatCurrency(stats.cancelledAmount)}
        icon={<BadgeX className="h-5 w-5 text-red-500" />}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, subValue, icon }: StatCardProps) => (
  <Card>
    <CardContent className="p-6 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h4 className="text-2xl font-bold mt-1">{value}</h4>
        {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
      </div>
      <div className="bg-muted rounded-full p-2">
        {icon}
      </div>
    </CardContent>
  </Card>
);

export default InvoiceStats;
