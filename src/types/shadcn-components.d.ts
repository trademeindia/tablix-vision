
import React from 'react';

// Card component type definitions
declare module '@/components/ui/card' {
  export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
  
  export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
  
  export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children?: React.ReactNode;
  }
  
  export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
  
  export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
}

// Table component type definitions
declare module '@/components/ui/table' {
  export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
    children?: React.ReactNode;
  }
  
  export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children?: React.ReactNode;
  }
  
  export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children?: React.ReactNode;
  }
  
  export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    children?: React.ReactNode;
  }
  
  export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    children?: React.ReactNode;
  }
  
  export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children?: React.ReactNode;
  }
}

// Chart component type definitions
declare module '@/components/ui/chart/chart-tooltip' {
  export interface ExtendedTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
    active?: boolean;
    payload?: any[];
    label?: string;
    labelFormatter?: (label: any) => React.ReactNode;
    labelClassName?: string;
    children?: React.ReactNode;
  }
}

declare module '@/components/ui/chart/chart-legend' {
  export interface ExtendedLegendProps {
    payload?: any[];
    verticalAlign?: string;
    children?: React.ReactNode;
  }
}

// Sheet component type definitions
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
