
declare module 'input-otp' {
  import { ComponentPropsWithoutRef } from 'react';

  export interface InputOtpProps extends ComponentPropsWithoutRef<'div'> {
    className?: string;
    containerClassName?: string;
    slots?: any[];
  }

  export interface InputOtpRootProps extends InputOtpProps {
    className?: string;
    containerClassName?: string;
  }

  export interface SlotProps {
    char: string | null;
    hasFakeCaret: boolean;
    isActive: boolean;
    className?: string;
  }

  export const OTPInput: React.FC<InputOtpProps>;
}
