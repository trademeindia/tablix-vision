
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

  export class Helmet extends React.Component<HelmetProps> {}
  export class HelmetProvider extends React.Component<{context?: any; children?: React.ReactNode}> {}
}
