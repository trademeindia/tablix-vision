
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Invoice, InvoiceItem } from '@/services/invoice';
import { formatCurrency } from '@/utils/format';

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
}

export const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({
  items,
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground italic">
        No items in this invoice
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Item</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            {(items.some(item => item.discount_percentage && item.discount_percentage > 0)) && (
              <TableHead className="text-right">Discount</TableHead>
            )}
            {(items.some(item => item.tax_percentage && item.tax_percentage > 0)) && (
              <TableHead className="text-right">Tax</TableHead>
            )}
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id || index}>
              <TableCell className="font-medium">
                {item.name}
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                )}
              </TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
              
              {(items.some(item => item.discount_percentage && item.discount_percentage > 0)) && (
                <TableCell className="text-right">
                  {item.discount_percentage && item.discount_percentage > 0 
                    ? `${item.discount_percentage}%` 
                    : '-'}
                </TableCell>
              )}
              
              {(items.some(item => item.tax_percentage && item.tax_percentage > 0)) && (
                <TableCell className="text-right">
                  {item.tax_percentage && item.tax_percentage > 0 
                    ? `${item.tax_percentage}%` 
                    : '-'}
                </TableCell>
              )}
              
              <TableCell className="text-right">{formatCurrency(item.total_price)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
