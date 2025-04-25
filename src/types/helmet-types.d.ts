
import React from 'react';

declare module 'react-helmet-async' {
  export interface HelmetProps {
    [key: string]: any;
    children?: React.ReactNode;
  }

  export const Helmet: React.FC<HelmetProps>;
  export const HelmetProvider: React.FC<{children: React.ReactNode}>;
}
