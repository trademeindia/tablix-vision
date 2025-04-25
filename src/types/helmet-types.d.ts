
import React from 'react';

declare module 'react-helmet-async' {
  export interface HelmetProps {
    [key: string]: any;
    children?: React.ReactNode;
  }

  export class Helmet extends React.Component<HelmetProps> {}
  export class HelmetProvider extends React.Component<{ children: React.ReactNode }> {}
}
