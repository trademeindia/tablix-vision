
// Type definitions to extend React's global types
import React from 'react';
import { HelmetProps } from 'react-helmet-async';

// Add missing HTMLTable attributes and React component props
declare module 'react' {
  // Fix table element attributes
  interface HTMLAttributes<T> extends React.AriaAttributes, React.DOMAttributes<T> {
    colSpan?: number;
    className?: string;
    children?: React.ReactNode;
  }
  
  interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
    colSpan?: number;
    className?: string;
    children?: React.ReactNode;
  }
  
  interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
    colSpan?: number;
    rowSpan?: number;
    scope?: string;
    className?: string;
    children?: React.ReactNode;
  }
  
  // Fix table section element types
  interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
    children?: React.ReactNode;
    className?: string;
  }
  
  interface TableSectionHTMLAttributes<T> extends HTMLAttributes<T> {
    children?: React.ReactNode;
    className?: string;
  }
  
  interface TableRowHTMLAttributes<T> extends HTMLAttributes<T> {
    children?: React.ReactNode;
    className?: string;
  }

  // Fix event handling types
  interface SyntheticEvent<T = Element> {
    target: EventTarget & T;
  }
  
  interface EventTarget {
    value?: string;
    name?: string;
    files?: FileList;
  }
  
  // Fix component types
  interface FunctionComponent<P = {}> {
    (props: P & { children?: React.ReactNode }, context?: any): React.ReactElement | null;
    propTypes?: React.WeakValidationMap<P>;
    contextTypes?: React.ValidationMap<any>;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  // Fix heading element types
  interface HTMLHeadingElement extends HTMLElement {
    className?: string;
  }
}

// Fix Helmet props
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'helmet': HelmetProps & React.PropsWithChildren<{}>;
    }
  }
}

// Add missing shadcn component types
declare module '@/components/ui/sheet' {
  export interface SheetContentProps {
    children?: React.ReactNode;
    className?: string;
    side?: "top" | "right" | "bottom" | "left";
  }
}

// Add missing chart component types
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
