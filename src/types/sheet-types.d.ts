
import React from 'react';

declare module '@/components/ui/sheet' {
  export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
    side?: "top" | "right" | "bottom" | "left";
    children?: React.ReactNode;
    className?: string;
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    onPointerDownOutside?: (event: PointerEvent) => void;
    onFocusOutside?: (event: FocusEvent) => void;
    onInteractOutside?: (event: React.SyntheticEvent) => void;
    forceMount?: boolean;
  }
}
