
import React from 'react';
import { Invoice } from '@/services/invoice';
import { formatDate } from '@/utils/format';

interface InvoiceCustomerInfoProps {
  invoice: Invoice;
}

export const InvoiceCustomerInfo: React.FC<InvoiceCustomerInfoProps> = ({
  invoice,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
      <div>
        <h4 className="text-sm font-semibold mb-1">Bill To:</h4>
        <p className="text-sm">{invoice.customer_name || 'Guest Customer'}</p>
        {invoice.customer_id && (
          <p className="text-xs text-muted-foreground">Customer ID: {invoice.customer_id}</p>
        )}
      </div>
      <div className="text-right">
        <div className="mb-2">
          <span className="text-sm text-muted-foreground">Invoice Date: </span>
          <span className="text-sm">
            {invoice.created_at ? formatDate(invoice.created_at) : 'N/A'}
          </span>
        </div>
        <div className="mb-2">
          <span className="text-sm text-muted-foreground">Invoice Number: </span>
          <span className="text-sm">{invoice.invoice_number}</span>
        </div>
        <div className="mb-2">
          <span className="text-sm text-muted-foreground">Order ID: </span>
          <span className="text-sm">{invoice.order_id || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};
