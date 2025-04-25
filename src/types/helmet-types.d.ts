
import { Component } from 'react';

declare module 'react-helmet-async' {
  export interface HelmetProps {
    [key: string]: any;
    children?: React.ReactNode;
  }

  export class Helmet extends Component<HelmetProps> {}
  export class HelmetProvider extends Component<{ children: React.ReactNode }> {}
}
