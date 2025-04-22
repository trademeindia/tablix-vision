
import * as React from 'react';
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

const LoadingButton = ({ 
  isLoading = false, 
  loadingText = "Loading...", 
  children,
  ...props 
}: LoadingButtonProps) => {
  // Only pass disabled if it's a valid prop for Button
  const { disabled, ...restProps } = props;
  return (
    <Button
      {...restProps}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
