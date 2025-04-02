
import React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyPlateProps extends React.HTMLAttributes<SVGElement> {
  className?: string;
}

export const EmptyPlate = React.forwardRef<SVGSVGElement, EmptyPlateProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('', className)}
        ref={ref}
        {...props}
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="7" strokeDasharray="3 3" />
        <path d="M7 9a5 5 0 0 1 10 0" />
        <path d="M16 14a2 2 0 0 1-8 0" />
      </svg>
    );
  }
);

EmptyPlate.displayName = 'EmptyPlate';

// Add a default export as well to ensure it can be imported correctly
export default EmptyPlate;
