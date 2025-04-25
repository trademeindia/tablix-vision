
declare module 'react-helmet-async' {
  import * as React from 'react';

  export interface HelmetProps {
    [key: string]: any;
    children?: React.ReactNode;
  }

  export const Helmet: React.FC<HelmetProps>;
  
  export interface HelmetProviderProps {
    children?: React.ReactNode;
    context?: any;
  }
  
  export const HelmetProvider: React.FC<HelmetProviderProps>;
}
