
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download, Share2 } from 'lucide-react';
import { Invoice } from '@/services/invoice';

interface InvoiceActionsProps {
  invoice: Invoice;
  onUpdateStatus?: (status: Invoice['status']) => void;
  onPrint?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  invoice,
  onUpdateStatus,
  onPrint,
  onDownload,
  onShare,
}) => {
  return (
    <div className="border-t bg-muted/50 flex justify-between p-6 print:hidden">
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
    </div>
  );
};
