
import React from 'react';

interface InvoiceNotesProps {
  notes?: string;
}

const InvoiceNotes: React.FC<InvoiceNotesProps> = ({ notes }) => {
  if (!notes) return null;
  
  return (
    <div className="mt-8 border-t pt-4">
      <h4 className="text-sm font-medium mb-2">Notes:</h4>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{notes}</p>
    </div>
  );
};

export default InvoiceNotes;
