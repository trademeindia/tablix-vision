
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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Unit Price</TableHead>
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
            <TableCell className="text-right">{formatCurrency(item.total_price)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
