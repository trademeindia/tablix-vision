
import React from 'react';

declare module '@/components/ui/chart/chart-tooltip' {
  export interface ExtendedTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
    active?: boolean;
    payload?: any[];
    label?: string;
    labelFormatter?: (label: any) => React.ReactNode;
    labelClassName?: string;
  }
}

declare module '@/components/ui/chart/chart-legend' {
  export interface ExtendedLegendProps {
    payload?: any[];
    verticalAlign?: string;
  }
}

declare module 'input-otp' {
  export interface OTPInputContext {
    slots: {
      char: string;
      hasFakeCaret: boolean;
      isActive: boolean;
    }[];
  }
}
