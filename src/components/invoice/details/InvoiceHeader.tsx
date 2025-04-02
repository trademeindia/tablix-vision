
import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Invoice } from '@/services/invoice';

interface InvoiceHeaderProps {
  invoice: Invoice;
  restaurantName: string;
  restaurantAddress: string;
}

const getStatusBadgeVariant = (status: Invoice['status']) => {
  switch (status) {
    case 'draft': return 'outline';
    case 'issued': return 'secondary';
    case 'paid': return 'default';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  invoice,
  restaurantName,
  restaurantAddress,
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between border-b">
      <div>
        <h2 className="text-lg font-bold">{restaurantName}</h2>
        <p className="text-sm text-muted-foreground">{restaurantAddress}</p>
      </div>
      <div className="text-right">
        <h3 className="text-lg font-bold">Invoice</h3>
        <p className="text-sm text-muted-foreground">#{invoice.invoice_number}</p>
        <Badge variant={getStatusBadgeVariant(invoice.status)}>
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </Badge>
      </div>
    </CardHeader>
  );
};
