
import * as React from 'react';

declare module 'react-helmet-async' {
  export interface HelmetProps {
    [key: string]: any;
    children?: React.ReactNode;
    title?: string;
    meta?: React.ReactNode[];
  }

  export class Helmet extends React.Component<HelmetProps> {}
  
  export interface HelmetProviderProps {
    children?: React.ReactNode;
    context?: any;
  }
  
  export class HelmetProvider extends React.Component<HelmetProviderProps> {}
}
