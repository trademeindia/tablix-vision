
import React from 'react';

declare module 'react-helmet-async' {
  export interface HelmetProps {
    [key: string]: any;
    children?: React.ReactNode;
    title?: string;
    defer?: boolean;
    encodeSpecialCharacters?: boolean;
    htmlAttributes?: any;
    base?: any;
    link?: any;
    script?: any;
    style?: any;
    meta?: Array<any>;
    noscript?: any;
    onChangeClientState?: (newState: any, addedTags: any, removedTags: any) => void;
  }

  // For proper JSX usage - fixed to use React.ComponentType instead of React.FC
  export const Helmet: React.ComponentType<HelmetProps>;
  export const HelmetProvider: React.ComponentType<{context?: any; children?: React.ReactNode}>;
}
