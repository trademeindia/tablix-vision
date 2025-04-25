
declare module 'react-helmet-async' {
  import React from 'react';

  export interface HelmetProps {
    [key: string]: any;
    children?: React.ReactNode;
  }

  export class Helmet extends React.Component<HelmetProps> {}
  export class HelmetProvider extends React.Component<{ children: React.ReactNode }> {}
}
