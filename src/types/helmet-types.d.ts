
import * as React from 'react';

declare module 'react-helmet-async' {
  export const Helmet: React.FC<{
    [key: string]: any;
    children?: React.ReactNode;
    title?: string;
    meta?: React.ReactNode[];
  }>;
  
  export const HelmetProvider: React.FC<{
    children?: React.ReactNode;
    context?: any;
  }>;
}
