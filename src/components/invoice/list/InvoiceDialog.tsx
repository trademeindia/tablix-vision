
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Mail 
} from 'lucide-react';
import { Invoice } from '@/services/invoice/types';
import InvoiceDetails from '@/components/invoice/InvoiceDetails';
import PrintInvoice from '@/components/invoice/PrintInvoice';

interface InvoiceDialogProps {
  invoice: Invoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantName: string;
  restaurantAddress: string;
  onUpdateStatus: (status: Invoice['status']) => Promise<void>;
  onPrint: () => void;
  onDownloadPNG: () => Promise<void>;
  onDownloadPDF: () => Promise<void>;
  onShare: () => Promise<void>;
  onEmail: () => void;
  isSharing: boolean;
}

const InvoiceDialog: React.FC<InvoiceDialogProps> = ({
  invoice,
  open,
  onOpenChange,
  restaurantName,
  restaurantAddress,
  onUpdateStatus,
  onPrint,
  onDownloadPNG,
  onDownloadPDF,
  onShare,
  onEmail,
  isSharing,
}) => {
  const navigate = useNavigate();

  const handleClose = () => {
    onOpenChange(false);
    navigate('/invoices', { replace: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Button variant="ghost" size="sm" onClick={handleClose} className="mr-2 p-0 h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            Invoice #{invoice.invoice_number}
          </DialogTitle>
        </DialogHeader>

        <InvoiceDetails
          invoice={invoice}
          restaurantName={restaurantName}
          restaurantAddress={restaurantAddress}
          onPrint={onPrint}
          onDownload={onDownloadPDF}
          onShare={onShare}
          onUpdateStatus={onUpdateStatus}
        />

        <div className="flex flex-wrap justify-end gap-2 mt-4">
          <PrintInvoice
            invoice={invoice}
            restaurantName={restaurantName}
            restaurantAddress={restaurantAddress}
          />

          <Button variant="outline" onClick={onDownloadPNG} disabled={isSharing}>
            <Download className="h-4 w-4 mr-2" />
            Download PNG
          </Button>

          <Button variant="outline" onClick={onDownloadPDF} disabled={isSharing}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>

          <Button variant="outline" onClick={onShare} disabled={isSharing}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>

          <Button variant="outline" onClick={onEmail} disabled={isSharing}>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;
