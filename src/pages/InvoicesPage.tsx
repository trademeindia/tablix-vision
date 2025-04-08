
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import InvoiceList from '@/components/invoice/InvoiceList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useInvoices } from '@/hooks/invoice/use-invoices';
import { useInvoiceActions } from '@/hooks/invoice/use-invoice-actions';
import InvoiceDialog from '@/components/invoice/list/InvoiceDialog';
import InvoiceStats from '@/components/invoice/InvoiceStats';

const InvoicesPage = () => {
  const navigate = useNavigate();

  // Mock restaurant data - in a real app, get this from context or API
  const restaurantData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Gourmet Delight Restaurant',
    address: '123 Foodie Street, Culinary District, Flavortown',
  };

  const {
    invoices,
    setInvoices,
    selectedInvoice,
    setSelectedInvoice,
    isLoading,
    invoiceDialogOpen,
    setInvoiceDialogOpen,
    handleViewInvoice,
    handleCloseInvoiceDialog
  } = useInvoices(restaurantData.id);

  const {
    isSharing,
    handleUpdateStatus,
    handlePrintInvoice,
    handleDownloadAsPNG,
    handleDownloadAsPDF,
    handleShareInvoice,
    handleEmailInvoice
  } = useInvoiceActions(selectedInvoice, setSelectedInvoice, setInvoices, restaurantData.name);

  const handleCreateInvoice = () => {
    navigate('/create-invoice');
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
      
      {/* Invoice statistics section */}
      <div className="mb-6">
        <InvoiceStats invoices={invoices} isLoading={isLoading} />
      </div>
      
      <InvoiceList 
        invoices={invoices}
        onViewInvoice={handleViewInvoice}
        isLoading={isLoading}
      />
      
      {selectedInvoice && (
        <InvoiceDialog
          invoice={selectedInvoice}
          open={invoiceDialogOpen}
          onOpenChange={setInvoiceDialogOpen}
          restaurantName={restaurantData.name}
          restaurantAddress={restaurantData.address}
          onUpdateStatus={handleUpdateStatus}
          onPrint={handlePrintInvoice}
          onDownloadPNG={handleDownloadAsPNG}
          onDownloadPDF={handleDownloadAsPDF}
          onShare={handleShareInvoice}
          onEmail={handleEmailInvoice}
          isSharing={isSharing}
        />
      )}
    </DashboardLayout>
  );
};

export default InvoicesPage;
