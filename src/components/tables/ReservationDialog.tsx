
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface ReservationFormData {
  tableId: string;
  customerName: string;
  contactNumber: string;
  date: string;
  time: string;
  guestCount: number;
  specialInstructions: string;
}

interface ReservationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reservationData: ReservationFormData;
  setReservationData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  onSubmit: (e: React.FormEvent) => void;
}

const ReservationDialog: React.FC<ReservationDialogProps> = ({
  isOpen,
  onOpenChange,
  reservationData,
  setReservationData,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make a Reservation</DialogTitle>
          <DialogDescription>
            Fill in the details to reserve this table.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="customerName" className="text-sm font-medium">Customer Name</label>
            <input
              id="customerName"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={reservationData.customerName}
              onChange={(e) => setReservationData({ ...reservationData, customerName: e.target.value })}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="contactNumber" className="text-sm font-medium">Contact Number</label>
            <input
              id="contactNumber"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={reservationData.contactNumber}
              onChange={(e) => setReservationData({ ...reservationData, contactNumber: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="date" className="text-sm font-medium">Date</label>
              <input
                id="date"
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={reservationData.date}
                onChange={(e) => setReservationData({ ...reservationData, date: e.target.value })}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="time" className="text-sm font-medium">Time</label>
              <input
                id="time"
                type="time"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={reservationData.time}
                onChange={(e) => setReservationData({ ...reservationData, time: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="guestCount" className="text-sm font-medium">Number of Guests</label>
            <input
              id="guestCount"
              type="number"
              min="1"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={reservationData.guestCount}
              onChange={(e) => setReservationData({ ...reservationData, guestCount: parseInt(e.target.value) || 1 })}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="specialInstructions" className="text-sm font-medium">Special Instructions</label>
            <textarea
              id="specialInstructions"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={reservationData.specialInstructions}
              onChange={(e) => setReservationData({ ...reservationData, specialInstructions: e.target.value })}
            />
          </div>
          
          <DialogFooter>
            <Button type="submit">Create Reservation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;
