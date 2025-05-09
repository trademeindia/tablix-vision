
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Invoice } from '@/services/invoice';
import InvoiceDetails from './InvoiceDetails';

interface PrintInvoiceProps {
  invoice: Invoice;
  restaurantName?: string;
  restaurantAddress?: string;
  buttonLabel?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onPrintComplete?: () => void;
  className?: string;
}

const PrintInvoice: React.FC<PrintInvoiceProps> = ({
  invoice,
  restaurantName = 'Restaurant',
  restaurantAddress = '',
  buttonLabel = 'Print Invoice',
  variant = 'outline',
  size = 'default',
  onPrintComplete,
  className
}) => {
  const componentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: onPrintComplete,
    documentTitle: `Invoice-${invoice.invoice_number}`,
  });
  
  return (
    <>
      <Button onClick={handlePrint} variant={variant} size={size} className={className}>
        <Printer className="h-4 w-4 mr-2" />
        {buttonLabel}
      </Button>
      
      <div style={{ display: 'none' }}>
        <div ref={componentRef} className="p-6">
          <InvoiceDetails 
            invoice={invoice} 
            restaurantName={restaurantName}
            restaurantAddress={restaurantAddress}
          />
        </div>
      </div>
    </>
  );
};

export default PrintInvoice;
