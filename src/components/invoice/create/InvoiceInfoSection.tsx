
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Invoice } from '@/services/invoice/types';

interface InvoiceInfoSectionProps {
  invoiceData: {
    customer_name: string;
    customer_id: string;
    order_id: string;
    status: Invoice['status'];
    notes: string;
    payment_method: string;
    payment_reference: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const InvoiceInfoSection: React.FC<InvoiceInfoSectionProps> = ({
  invoiceData,
  handleInputChange,
  handleSelectChange,
}) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Invoice Information</CardTitle>
        <CardDescription>Enter the invoice details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customer_name">Customer Name *</Label>
            <Input
              id="customer_name"
              name="customer_name"
              value={invoiceData.customer_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer_id">Customer ID (optional)</Label>
            <Input
              id="customer_id"
              name="customer_id"
              value={invoiceData.customer_id}
              onChange={handleInputChange}
              placeholder="Use valid UUID or leave empty"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="order_id">Related Order ID (optional)</Label>
            <Input
              id="order_id"
              name="order_id"
              value={invoiceData.order_id}
              onChange={handleInputChange}
              placeholder="Use valid UUID or leave empty"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={invoiceData.status}
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="issued">Issued</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {invoiceData.status === 'paid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select
                value={invoiceData.payment_method}
                onValueChange={(value) => handleSelectChange('payment_method', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="online">Online Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_reference">Payment Reference</Label>
              <Input
                id="payment_reference"
                name="payment_reference"
                value={invoiceData.payment_reference}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={invoiceData.notes}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceInfoSection;
