
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import CustomerMenuLayout from '@/components/layout/CustomerMenuLayout';
import OrderSummaryCard from '@/components/customer/checkout/OrderSummaryCard';
import CustomerInfoForm from '@/components/customer/checkout/CustomerInfoForm';
import PaymentMethodCard from '@/components/customer/checkout/PaymentMethodCard';
import OrderSuccessView from '@/components/customer/checkout/OrderSuccessView';
import EmptyCartView from '@/components/customer/checkout/EmptyCartView';
import MissingInfoView from '@/components/customer/checkout/MissingInfoView';
import { useCheckout } from '@/hooks/use-checkout';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { 
    tableId, 
    restaurantId, 
    orderItems, 
    name, 
    email, 
    phone, 
    notes,
    isSubmitting, 
    isSuccess, 
    orderId,
    setName,
    setEmail,
    setPhone,
    setNotes,
    handleSubmitOrder
  } = useCheckout();

  // Missing table or restaurant info
  if (!tableId || !restaurantId) {
    return <MissingInfoView />;
  }
  
  // Empty cart
  if (orderItems.length === 0 && !isSuccess) {
    return (
      <CustomerMenuLayout 
        tableId={tableId} 
        restaurantId={restaurantId}
        orderItemsCount={0}
      >
        <EmptyCartView tableId={tableId} restaurantId={restaurantId} />
      </CustomerMenuLayout>
    );
  }
  
  // Order success
  if (isSuccess) {
    return (
      <CustomerMenuLayout 
        tableId={tableId} 
        restaurantId={restaurantId}
        orderItemsCount={0}
      >
        <OrderSuccessView 
          name={name} 
          orderId={orderId} 
          tableId={tableId} 
          restaurantId={restaurantId} 
        />
      </CustomerMenuLayout>
    );
  }
  
  // Order checkout
  return (
    <CustomerMenuLayout 
      tableId={tableId} 
      restaurantId={restaurantId}
      orderItemsCount={orderItems.reduce((total, item) => total + item.quantity, 0)}
    >
      <div className="py-4">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Order Summary</h2>
          <OrderSummaryCard orderItems={orderItems} />
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Your Information</h2>
          <CustomerInfoForm
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
            notes={notes}
            setNotes={setNotes}
          />
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Payment</h2>
          <PaymentMethodCard />
        </div>
        
        <Button
          className="w-full mb-12"
          size="lg"
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </Button>
      </div>
    </CustomerMenuLayout>
  );
};

export default CheckoutPage;
