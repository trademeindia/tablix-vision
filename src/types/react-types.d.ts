
// Type definitions to extend React's global types
import React from 'react';
import { HelmetProps } from 'react-helmet-async';

// Add missing HTMLTable attributes and React component props
declare module 'react' {
  // Fix table element attributes
  interface HTMLAttributes<T> extends React.AriaAttributes, React.DOMAttributes<T> {
    colSpan?: number;
    children?: React.ReactNode;
  }
  
  interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
    colSpan?: number;
    children?: React.ReactNode;
  }
  
  interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
    colSpan?: number;
    rowSpan?: number;
    scope?: string;
    children?: React.ReactNode;
  }
  
  // Fix table section element types
  interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
    children?: React.ReactNode;
  }
  
  interface TableSectionHTMLAttributes<T> extends HTMLAttributes<T> {
    children?: React.ReactNode;
  }
  
  interface TableRowHTMLAttributes<T> extends HTMLAttributes<T> {
    children?: React.ReactNode;
  }

  // Fix event handling types
  interface SyntheticEvent<T = Element> {
    target: EventTarget & T;
  }
  
  interface EventTarget {
    value?: string;
    name?: string;
    files?: FileList;
  }
  
  // Fix component types
  interface FunctionComponent<P = {}> {
    (props: P & { children?: React.ReactNode }, context?: any): React.ReactElement | null;
    propTypes?: React.WeakValidationMap<P>;
    contextTypes?: React.ValidationMap<any>;
    defaultProps?: Partial<P>;
    displayName?: string;
  }
}

// Fix Helmet props
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'helmet': HelmetProps & React.PropsWithChildren<{}>;
    }
  }
}
