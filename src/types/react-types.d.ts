
// Type definitions to extend React's global types
import React from 'react';
import { HelmetProps } from 'react-helmet-async';

// Add missing HTMLTable attributes
declare module 'react' {
  interface HTMLAttributes<T> extends React.AriaAttributes, React.DOMAttributes<T> {
    colSpan?: number;
  }
  
  interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
    colSpan?: number;
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
}

// Fix Helmet props
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'helmet': HelmetProps & React.PropsWithChildren<{}>;
    }
  }
}
