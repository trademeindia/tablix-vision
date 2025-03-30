
import { useState } from 'react';

export interface CheckoutFormState {
  name: string;
  email: string;
  phone: string;
  notes: string;
  isSubmitting: boolean;
  isSuccess: boolean;
  orderId: string | null;
}

export interface CheckoutFormActions {
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setNotes: (notes: string) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setOrderId: (orderId: string | null) => void;
}

export function useCheckoutState(): CheckoutFormState & CheckoutFormActions {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  return {
    // State
    name,
    email,
    phone,
    notes,
    isSubmitting,
    isSuccess,
    orderId,
    
    // Actions
    setName,
    setEmail,
    setPhone,
    setNotes,
    setIsSubmitting,
    setIsSuccess,
    setOrderId
  };
}
