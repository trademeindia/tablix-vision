
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Invoice } from '@/services/invoice';
import { InvoiceHeader } from './details/InvoiceHeader';
import { InvoiceCustomerInfo } from './details/InvoiceCustomerInfo';
import { InvoiceItemsTable } from './details/InvoiceItemsTable';
import { InvoiceSummary } from './details/InvoiceSummary';
import { InvoiceNotes } from './details/InvoiceNotes';
import { InvoiceActions } from './details/InvoiceActions';

interface InvoiceDetailsProps {
  invoice: Invoice;
  restaurantName?: string;
  restaurantAddress?: string;
  onPrint?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onUpdateStatus?: (status: Invoice['status']) => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  invoice,
  restaurantName = 'Restaurant',
  restaurantAddress = '',
  onPrint,
  onDownload,
  onShare,
  onUpdateStatus
}) => {
  return (
    <Card className="shadow-md overflow-hidden print:shadow-none" id="invoice-print">
      <InvoiceHeader
        invoice={invoice}
        restaurantName={restaurantName}
        restaurantAddress={restaurantAddress}
      />
      
      <CardContent className="p-6">
        <InvoiceCustomerInfo invoice={invoice} />
        
        <InvoiceItemsTable items={invoice.items} />
        
        <InvoiceSummary invoice={invoice} />
        
        <InvoiceNotes notes={invoice.notes} />
      </CardContent>
      
      <CardFooter className="p-0">
        <InvoiceActions
          invoice={invoice}
          onUpdateStatus={onUpdateStatus}
          onPrint={onPrint}
          onDownload={onDownload}
          onShare={onShare}
        />
      </CardFooter>
    </Card>
  );
};

export default InvoiceDetails;
