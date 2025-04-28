
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

  // Fixed: Export Helmet as a React FunctionComponent
  export const Helmet: React.FC<HelmetProps> & {
    renderStatic(): any;
    canUseDOM: boolean;
  };
  
  export interface HelmetProviderProps {
    children?: React.ReactNode;
    context?: any;
  }
  
  // Fixed: Export HelmetProvider as a React FunctionComponent
  export const HelmetProvider: React.FC<HelmetProviderProps>;
}
