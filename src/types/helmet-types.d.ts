
import * as React from 'react';

interface HelmetProps {
  [key: string]: any;
  children?: React.ReactNode;
}

interface HelmetProviderProps {
  children?: React.ReactNode;
  context?: any;
}

declare module 'react-helmet-async' {
  export const Helmet: React.FC<HelmetProps>;
  export const HelmetProvider: React.FC<HelmetProviderProps>;
}
