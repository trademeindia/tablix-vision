import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import InvoiceList from '@/components/invoice/InvoiceList';
import InvoiceDetails from '@/components/invoice/InvoiceDetails';
import PrintInvoice from '@/components/invoice/PrintInvoice';
import { getRestaurantInvoices, getInvoiceById, updateInvoiceStatus } from '@/services/invoice';
import { Invoice } from '@/services/invoice/types';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleDownloadInvoice = async () => {
    if (!selectedInvoice) return;
    
    const element = document.getElementById('invoice-print');
    if (!element) return;
    
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
        description: 'Invoice downloaded successfully',
      });
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to download invoice',
        variant: 'destructive',
      });
    }
  };

  const handleShareInvoice = () => {
    // In a real app, this would share a link or send via email
    toast({
      title: 'Share Feature',
      description: 'Invoice sharing functionality coming soon!',
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
              onDownload={handleDownloadInvoice}
              onShare={handleShareInvoice}
              onUpdateStatus={handleUpdateStatus}
            />
            
            <div className="flex justify-end gap-2 mt-4">
              <PrintInvoice
                invoice={selectedInvoice}
                restaurantName={restaurantData.name}
                restaurantAddress={restaurantData.address}
              />
              <Button variant="outline" onClick={handleDownloadInvoice}>
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default InvoicesPage;
