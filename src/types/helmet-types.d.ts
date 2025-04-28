
import * as React from 'react';

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

  export class Helmet extends React.Component<HelmetProps> {}
  
  export interface HelmetProviderProps {
    children?: React.ReactNode;
    context?: any;
  }
  
  export class HelmetProvider extends React.Component<HelmetProviderProps> {}
}
