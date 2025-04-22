
import 'recharts';
import * as React from 'react';

// Augment the existing recharts declarations
declare module 'recharts' {
  // Make all recharts components accept JSX props properly
  export interface LineProps {
    children?: React.ReactNode;
    type?: string;
    dataKey?: string;
    stroke?: string;
    strokeWidth?: number;
    dot?: any;
    activeDot?: any;
  }
  
  export interface BarProps {
    children?: React.ReactNode;
    dataKey?: string;
    fill?: string;
    name?: string;
    yAxisId?: string;
  }
  
  export interface PieProps {
    children?: React.ReactNode;
    data?: any[];
    cx?: string | number;
    cy?: string | number;
    labelLine?: boolean;
    outerRadius?: number;
    fill?: string;
    dataKey?: string;
    label?: any;
  }
  
  export interface XAxisProps {
    children?: React.ReactNode;
    dataKey?: string;
    tickFormatter?: (value: any) => string;
    tick?: any;
    tickMargin?: number;
    stroke?: string;
    interval?: string | number;
  }
  
  export interface YAxisProps {
    children?: React.ReactNode;
    yAxisId?: string;
    orientation?: string;
    tickFormatter?: (value: any) => string;
    tick?: any;
    tickMargin?: number;
    stroke?: string;
    label?: any;
  }
  
  export interface TooltipProps {
    children?: React.ReactNode;
    content?: React.ReactElement | ((props: any) => React.ReactElement);
    formatter?: (value: any, name?: any, props?: any) => string | string[];
  }
  
  export interface LegendProps {
    children?: React.ReactNode;
  }
  
  export interface AreaProps {
    children?: React.ReactNode;
    type?: string;
    dataKey?: string;
    stroke?: string;
    strokeWidth?: number;
    fillOpacity?: number;
    fill?: string;
  }
  
  export interface CartesianGridProps {
    children?: React.ReactNode;
    strokeDasharray?: string;
    stroke?: string;
  }
  
  export interface ReferenceLineProps {
    children?: React.ReactNode;
    y?: number | string;
    x?: number | string;
    stroke?: string;
    strokeDasharray?: string;
    label?: any;
  }
  
  export interface CellProps {
    children?: React.ReactNode;
    key?: string;
    fill?: string;
  }

  // Use React.FC instead of defining custom class components
  export const XAxis: React.FC<XAxisProps>;
  export const YAxis: React.FC<YAxisProps>;
  export const CartesianGrid: React.FC<CartesianGridProps>;
  export const Tooltip: React.FC<TooltipProps>;
  export const Legend: React.FC<LegendProps>;
  export const Line: React.FC<LineProps>;
  export const Bar: React.FC<BarProps>;
  export const Pie: React.FC<PieProps>;
  export const Cell: React.FC<CellProps>;
  export const ReferenceLine: React.FC<ReferenceLineProps>;
  export const Area: React.FC<AreaProps>;
}
