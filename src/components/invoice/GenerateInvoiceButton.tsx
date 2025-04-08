
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Receipt, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Order } from '@/services/order/types';
import { createInvoiceFromOrder } from '@/services/invoice';

interface GenerateInvoiceButtonProps {
  order: Order;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onSuccess?: (invoiceId: string) => void;
  className?: string;
}

const GenerateInvoiceButton: React.FC<GenerateInvoiceButtonProps> = ({ 
  order, 
  size = 'default',
  variant = 'outline',
  onSuccess,
  className
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleGenerateInvoice = async () => {
    if (!order.id) {
      toast({
        title: "Error",
        description: "Cannot generate invoice: Order ID is missing",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Fix: Access the result correctly with destructuring
      const { invoice, error } = await createInvoiceFromOrder(order);
      
      if (invoice && invoice.id) {
        toast({
          title: "Success",
          description: "Invoice generated successfully",
        });
        
        if (onSuccess) {
          onSuccess(invoice.id);
        } else {
          navigate(`/invoices/${invoice.id}`);
        }
      } else {
        toast({
          title: "Error",
          description: error || "Failed to generate invoice. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while generating the invoice",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Button
      onClick={handleGenerateInvoice}
      size={size}
      variant={variant}
      disabled={isGenerating}
      className={className}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Receipt className="h-4 w-4 mr-2" />
          Generate Invoice
        </>
      )}
    </Button>
  );
};

export default GenerateInvoiceButton;
