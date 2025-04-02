
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Download, Printer, Share2 } from 'lucide-react';
import { Invoice } from '@/services/invoice';

interface InvoiceDetailsProps {
  invoice: Invoice;
  restaurantName?: string;
  restaurantAddress?: string;
  onPrint?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onUpdateStatus?: (status: Invoice['status']) => void;
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

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  invoice,
  restaurantName = 'Restaurant',
  restaurantAddress = '',
  onPrint,
  onDownload,
  onShare,
  onUpdateStatus
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };
  
  return (
    <Card className="shadow-md overflow-hidden print:shadow-none" id="invoice-print">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <div>
          <CardTitle>{restaurantName}</CardTitle>
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
      
      <CardContent className="p-6">
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
            {invoice.items.map((item, index) => (
              <TableRow key={item.id || index}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.total_price)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
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
        
        {invoice.notes && (
          <div className="mt-8">
            <h4 className="text-sm font-semibold mb-1">Notes:</h4>
            <p className="text-sm text-muted-foreground">{invoice.notes}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t bg-muted/50 flex justify-between print:hidden">
        <div>
          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && onUpdateStatus && (
            <Button 
              onClick={() => onUpdateStatus('paid')} 
              variant="default"
              className="mr-2"
            >
              Mark as Paid
            </Button>
          )}
          {invoice.status !== 'cancelled' && invoice.status !== 'paid' && onUpdateStatus && (
            <Button 
              onClick={() => onUpdateStatus('cancelled')} 
              variant="outline"
            >
              Cancel Invoice
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onPrint}>
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default InvoiceDetails;
