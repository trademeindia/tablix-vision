
import React from 'react';

interface InvoiceNotesProps {
  notes?: string;
}

export const InvoiceNotes: React.FC<InvoiceNotesProps> = ({
  notes,
}) => {
  if (!notes) return null;
  
  return (
    <div className="mt-8 border-t pt-4">
      <h4 className="text-sm font-semibold mb-1">Notes:</h4>
      <p className="text-sm text-muted-foreground break-words whitespace-pre-wrap">{notes}</p>
    </div>
  );
};
