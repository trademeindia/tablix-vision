
import React from 'react';
import { format } from 'date-fns';
import { Invoice } from '@/services/invoice';

interface InvoiceCustomerInfoProps {
  invoice: Invoice;
}

export const InvoiceCustomerInfo: React.FC<InvoiceCustomerInfoProps> = ({
  invoice,
}) => {
  return (
    <div className="flex justify-between mb-8">
      <div>
        <h4 className="text-sm font-semibold mb-1">Bill To:</h4>
        <p className="text-sm">{invoice.customer_name || 'Guest Customer'}</p>
        {/* Additional customer info can be added here */}
      </div>
      <div className="text-right">
        <div className="mb-2">
          <span className="text-sm text-muted-foreground">Invoice Date: </span>
          <span className="text-sm">
            {invoice.created_at ? format(new Date(invoice.created_at), 'dd MMM yyyy') : 'N/A'}
          </span>
        </div>
        <div className="mb-2">
          <span className="text-sm text-muted-foreground">Order ID: </span>
          <span className="text-sm">{invoice.order_id || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};
