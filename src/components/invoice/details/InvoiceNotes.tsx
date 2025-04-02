
import React from 'react';

interface InvoiceNotesProps {
  notes?: string;
}

export const InvoiceNotes: React.FC<InvoiceNotesProps> = ({
  notes,
}) => {
  if (!notes) return null;
  
  return (
    <div className="mt-8">
      <h4 className="text-sm font-semibold mb-1">Notes:</h4>
      <p className="text-sm text-muted-foreground">{notes}</p>
    </div>
  );
};
