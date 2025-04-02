
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Invoice } from '@/services/invoice';
import { formatCurrency } from '@/utils/format';

interface InvoiceSummaryProps {
  invoice: Invoice;
}

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  invoice,
}) => {
  return (
    <div className="mt-6 flex justify-end">
      <div className="w-1/2 md:w-1/3">
        <div className="flex justify-between py-2">
          <span>Subtotal:</span>
          <span>{formatCurrency(invoice.total_amount)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span>Tax ({((invoice.tax_amount / invoice.total_amount) * 100).toFixed(1)}%):</span>
          <span>{formatCurrency(invoice.tax_amount)}</span>
        </div>
        {invoice.discount_amount > 0 && (
          <div className="flex justify-between py-2">
            <span>Discount:</span>
            <span>-{formatCurrency(invoice.discount_amount)}</span>
          </div>
        )}
        <Separator className="my-2" />
        <div className="flex justify-between py-2 font-bold">
          <span>Total:</span>
          <span>{formatCurrency(invoice.final_amount)}</span>
        </div>
        {invoice.status === 'paid' && (
          <div className="mt-4 p-2 bg-green-50 text-green-700 rounded text-center">
            Paid on {invoice.updated_at ? format(new Date(invoice.updated_at), 'dd MMM yyyy') : 'N/A'}
            {invoice.payment_method && ` via ${invoice.payment_method}`}
          </div>
        )}
      </div>
    </div>
  );
};
