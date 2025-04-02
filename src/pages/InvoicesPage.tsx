
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import InvoiceList from '@/components/invoice/InvoiceList';
import InvoiceDetails from '@/components/invoice/InvoiceDetails';
import PrintInvoice from '@/components/invoice/PrintInvoice';
import { getRestaurantInvoices, getInvoiceById, updateInvoiceStatus } from '@/services/invoice';
import { Invoice } from '@/services/invoice/types';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, Download, Share2, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { invoiceId } = useParams();

  // Mock restaurant data - in a real app, get this from context or API
  const restaurantData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Gourmet Delight Restaurant',
    address: '123 Foodie Street, Culinary District, Flavortown',
  };

  // Load invoices on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      try {
        const data = await getRestaurantInvoices(restaurantData.id);
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        toast({
          title: 'Error',
          description: 'Failed to load invoices',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [restaurantData.id]);

  // If invoiceId param exists, load that specific invoice
  useEffect(() => {
    if (invoiceId) {
      const fetchInvoice = async () => {
        try {
          const invoice = await getInvoiceById(invoiceId);
          if (invoice) {
            setSelectedInvoice(invoice);
            setInvoiceDialogOpen(true);
          } else {
            toast({
              title: 'Error',
              description: 'Invoice not found',
              variant: 'destructive',
            });
            navigate('/invoices');
          }
        } catch (error) {
          console.error('Error fetching invoice details:', error);
          toast({
            title: 'Error',
            description: 'Failed to load invoice details',
            variant: 'destructive',
          });
        }
      };

      fetchInvoice();
    }
  }, [invoiceId, navigate]);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceDialogOpen(true);
    navigate(`/invoices/${invoice.id}`, { replace: true });
  };

  const handleCloseInvoiceDialog = () => {
    setInvoiceDialogOpen(false);
    setSelectedInvoice(null);
    navigate('/invoices', { replace: true });
  };

  const handleCreateInvoice = () => {
    navigate('/create-invoice');
  };

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
              text: `Invoice from ${restaurantData.name}`,
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
    const subject = encodeURIComponent(`Invoice #${selectedInvoice.invoice_number} from ${restaurantData.name}`);
    const body = encodeURIComponent(
      `Dear ${selectedInvoice.customer_name || 'Customer'},\n\n` +
      `Please find attached your invoice #${selectedInvoice.invoice_number} from ${restaurantData.name}.\n\n` +
      `Invoice Date: ${new Date(selectedInvoice.created_at || '').toLocaleDateString()}\n` +
      `Amount: $${selectedInvoice.final_amount.toFixed(2)}\n\n` +
      `Thank you for your business!\n` +
      `${restaurantData.name}\n` +
      `${restaurantData.address}`
    );
    
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    
    toast({
      title: 'Email Client Opened',
      description: 'Your default email client has been opened with the invoice details',
    });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-slate-500">Manage your restaurant invoices</p>
        </div>
        <Button onClick={handleCreateInvoice}>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>
      
      <InvoiceList 
        invoices={invoices}
        onViewInvoice={handleViewInvoice}
        isLoading={isLoading}
      />
      
      {selectedInvoice && (
        <Dialog open={invoiceDialogOpen} onOpenChange={handleCloseInvoiceDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Button variant="ghost" size="sm" onClick={handleCloseInvoiceDialog} className="mr-2 p-0 h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Invoice #{selectedInvoice.invoice_number}
              </DialogTitle>
            </DialogHeader>
            
            <InvoiceDetails
              invoice={selectedInvoice}
              restaurantName={restaurantData.name}
              restaurantAddress={restaurantData.address}
              onPrint={handlePrintInvoice}
              onDownload={handleDownloadAsPDF}
              onShare={handleShareInvoice}
              onUpdateStatus={handleUpdateStatus}
            />
            
            <div className="flex flex-wrap justify-end gap-2 mt-4">
              <PrintInvoice
                invoice={selectedInvoice}
                restaurantName={restaurantData.name}
                restaurantAddress={restaurantData.address}
              />
              
              <Button variant="outline" onClick={handleDownloadAsPNG} disabled={isSharing}>
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
              
              <Button variant="outline" onClick={handleDownloadAsPDF} disabled={isSharing}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              
              <Button variant="outline" onClick={handleShareInvoice} disabled={isSharing}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Button variant="outline" onClick={handleEmailInvoice} disabled={isSharing}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default InvoicesPage;
