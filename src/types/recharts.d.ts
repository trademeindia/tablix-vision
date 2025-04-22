
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
  
  // Fix component types by making them extend React.Component
  export class XAxis extends React.Component<XAxisProps> {}
  export class YAxis extends React.Component<YAxisProps> {}
  export class CartesianGrid extends React.Component<CartesianGridProps> {}
  export class Tooltip extends React.Component<TooltipProps> {}
  export class Legend extends React.Component<LegendProps> {}
  export class Line extends React.Component<LineProps> {}
  export class Bar extends React.Component<BarProps> {}
  export class Pie extends React.Component<PieProps> {}
  export class Cell extends React.Component<CellProps> {}
  export class ReferenceLine extends React.Component<ReferenceLineProps> {}
  export class Area extends React.Component<AreaProps> {}
}
