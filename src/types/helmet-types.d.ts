
import * as React from 'react';

declare module 'react-helmet-async' {
  export interface HelmetProps {
    [key: string]: any;
    children?: React.ReactNode;
    title?: string;
    meta?: React.ReactNode[];
  }

  export const Helmet: React.ComponentType<HelmetProps>;
  
  export interface HelmetProviderProps {
    children?: React.ReactNode;
    context?: any;
  }
  
  export const HelmetProvider: React.ComponentType<HelmetProviderProps>;
}
