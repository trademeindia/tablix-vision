
import React from 'react';

declare module 'react' {
  interface TdHTMLAttributes<T> extends React.HTMLAttributes<T> {
    colSpan?: number;
  }
  
  interface ThHTMLAttributes<T> extends React.HTMLAttributes<T> {
    colSpan?: number;
    rowSpan?: number;
    scope?: string;
  }
}
