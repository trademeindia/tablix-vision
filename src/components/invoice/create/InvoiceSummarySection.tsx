
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';

interface InvoiceSummarySectionProps {
  totals: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
  };
  isSubmitting: boolean;
}

const InvoiceSummarySection: React.FC<InvoiceSummarySectionProps> = ({ totals, isSubmitting }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${totals.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>${totals.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount:</span>
          <span>-${totals.discount.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${totals.total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>Creating Invoice...</>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Invoice
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvoiceSummarySection;
