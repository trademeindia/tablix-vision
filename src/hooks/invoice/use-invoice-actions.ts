
import { useState } from 'react';
import { Invoice } from '@/services/invoice/types';
import { updateInvoiceStatus } from '@/services/invoice';
import { toast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const useInvoiceActions = (
  selectedInvoice: Invoice | null,
  setSelectedInvoice: React.Dispatch<React.SetStateAction<Invoice | null>>,
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>,
  restaurantName: string
) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleUpdateStatus = async (status: Invoice['status']) => {
    if (!selectedInvoice?.id) return;
    
    try {
      const success = await updateInvoiceStatus(selectedInvoice.id, status);
      
      if (success) {
        toast({
          title: 'Success',
          description: `Invoice marked as ${status}`,
        });
        
        setSelectedInvoice(prev => prev ? { ...prev, status } : null);
        
        setInvoices(prev => 
          prev.map(inv => 
            inv.id === selectedInvoice.id 
              ? { ...inv, status } 
              : inv
          )
        );
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update invoice status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while updating status',
        variant: 'destructive',
      });
    }
  };

  const handlePrintInvoice = () => {
    // Printing is handled by the PrintInvoice component
  };

  const handleDownloadAsPNG = async () => {
    if (!selectedInvoice) return;
    
    setIsSharing(true);
    const element = document.getElementById('invoice-print');
    if (!element) {
      setIsSharing(false);
      return;
    }
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.href = imgData;
      downloadLink.download = `Invoice-${selectedInvoice.invoice_number}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast({
        title: 'Success',
        description: 'Invoice downloaded as PNG',
      });
    } catch (error) {
      console.error('Error downloading invoice as PNG:', error);
      toast({
        title: 'Error',
        description: 'Failed to download invoice',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadAsPDF = async () => {
    if (!selectedInvoice) return;
    
    setIsSharing(true);
    const element = document.getElementById('invoice-print');
    if (!element) {
      setIsSharing(false);
      return;
    }
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      
      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Invoice-${selectedInvoice.invoice_number}.pdf`);
      
      toast({
        title: 'Success',
        description: 'Invoice downloaded as PDF',
      });
    } catch (error) {
      console.error('Error downloading invoice as PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to download invoice as PDF',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareInvoice = async () => {
    if (!selectedInvoice) return;
    
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        setIsSharing(true);
        
        const canvas = await html2canvas(document.getElementById('invoice-print')!, {
          scale: 2,
          logging: false,
          useCORS: true,
        });
        
        canvas.toBlob(async (blob) => {
          if (!blob) {
            toast({
              title: 'Error',
              description: 'Failed to create image for sharing',
              variant: 'destructive',
            });
            setIsSharing(false);
            return;
          }
          
          const file = new File([blob], `Invoice-${selectedInvoice.invoice_number}.png`, { type: 'image/png' });
          
          try {
            await navigator.share({
              title: `Invoice #${selectedInvoice.invoice_number}`,
              text: `Invoice from ${restaurantName}`,
              files: [file],
            });
            
            toast({
              title: 'Success',
              description: 'Shared invoice successfully',
            });
          } catch (error) {
            console.error('Error sharing invoice:', error);
            toast({
              title: 'Error',
              description: 'Failed to share invoice',
              variant: 'destructive',
            });
          } finally {
            setIsSharing(false);
          }
        }, 'image/png');
      } catch (error) {
        console.error('Error preparing invoice for sharing:', error);
        toast({
          title: 'Error',
          description: 'Failed to prepare invoice for sharing',
          variant: 'destructive',
        });
        setIsSharing(false);
      }
    } else {
      // Fallback if Web Share API is not available
      toast({
        title: 'Sharing not supported',
        description: 'Please use the download option and share manually',
      });
    }
  };

  const handleEmailInvoice = () => {
    if (!selectedInvoice) return;
    
    // Create mailto link with invoice details
    const subject = encodeURIComponent(`Invoice #${selectedInvoice.invoice_number} from ${restaurantName}`);
    const body = encodeURIComponent(
      `Dear ${selectedInvoice.customer_name || 'Customer'},\n\n` +
      `Please find attached your invoice #${selectedInvoice.invoice_number} from ${restaurantName}.\n\n` +
      `Invoice Date: ${new Date(selectedInvoice.created_at || '').toLocaleDateString()}\n` +
      `Amount: $${selectedInvoice.final_amount.toFixed(2)}\n\n` +
      `Thank you for your business!\n` +
      `${restaurantName}`
    );
    
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    
    toast({
      title: 'Email Client Opened',
      description: 'Your default email client has been opened with the invoice details',
    });
  };

  return {
    isSharing,
    handleUpdateStatus,
    handlePrintInvoice,
    handleDownloadAsPNG,
    handleDownloadAsPDF,
    handleShareInvoice,
    handleEmailInvoice
  };
};
