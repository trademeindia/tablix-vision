
import 'recharts';
import * as React from 'react';

// Augment the existing recharts declarations
declare module 'recharts' {
  // Make all recharts components accept JSX props properly
  export interface LineProps {
    children?: React.ReactNode;
  }
  
  export interface BarProps {
    children?: React.ReactNode;
  }
  
  export interface PieProps {
    children?: React.ReactNode;
  }
  
  export interface XAxisProps {
    children?: React.ReactNode;
  }
  
  export interface YAxisProps {
    children?: React.ReactNode;
  }
  
  export interface TooltipProps {
    children?: React.ReactNode;
  }
  
  export interface LegendProps {
    children?: React.ReactNode;
  }
  
  export interface AreaProps {
    children?: React.ReactNode;
  }
  
  export interface CartesianGridProps {
    children?: React.ReactNode;
  }
  
  export interface ReferenceLineProps {
    children?: React.ReactNode;
  }
  
  export interface CellProps {
    children?: React.ReactNode;
  }

  // Use React.Component instead of defining custom class components
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
