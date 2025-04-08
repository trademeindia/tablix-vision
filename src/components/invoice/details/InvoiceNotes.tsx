
import React from 'react';

interface InvoiceNotesProps {
  notes?: string;
}

export const InvoiceNotes: React.FC<InvoiceNotesProps> = React.memo(({
  notes,
}) => {
  if (!notes) return null;
  
  return (
    <div className="mt-8 border-t pt-4">
      <h4 className="text-sm font-medium mb-2">Notes:</h4>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{notes}</p>
    </div>
  );
});

InvoiceNotes.displayName = 'InvoiceNotes';
