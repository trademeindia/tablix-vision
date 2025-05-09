
import React from 'react';

declare module 'react-helmet-async' {
  export interface HelmetProps {
    [key: string]: any;
    children?: React.ReactNode;
    title?: string;
    meta?: React.ReactNode[];
    defer?: boolean;
    encodeSpecialCharacters?: boolean;
    htmlAttributes?: any;
    base?: any;
    link?: any;
    script?: any;
    style?: any;
    noscript?: any;
    onChangeClientState?: (newState: any, addedTags: any, removedTags: any) => void;
  }

  // Use FunctionComponent instead of class definitions
  export const Helmet: React.FC<HelmetProps>;
  export const HelmetProvider: React.FC<{context?: any; children?: React.ReactNode}>;
}
