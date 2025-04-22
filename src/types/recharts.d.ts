
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
}
