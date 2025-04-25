
declare module 'input-otp' {
  import { ComponentPropsWithoutRef, ForwardRefExoticComponent, RefAttributes } from 'react';

  export interface InputOtpProps extends ComponentPropsWithoutRef<'div'> {
    className?: string;
    containerClassName?: string;
    slots?: any[];
    render?: (props: any) => React.ReactNode;
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

  export interface OTPInputProps extends InputOtpProps, RefAttributes<HTMLDivElement> {}

  export const OTPInput: ForwardRefExoticComponent<OTPInputProps>;
}
