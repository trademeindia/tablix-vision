
import 'react';

declare module 'react' {
  export interface FC<P = {}> {
    (props: P, context?: any): React.ReactElement<any, any> | null;
    displayName?: string;
    defaultProps?: Partial<P>;
  }

  export type FormEvent<T = Element> = React.SyntheticEvent<T, Event>;
  export type ChangeEvent<T = Element> = React.SyntheticEvent<T, Event>;
  export type FormHTMLAttributes<T> = React.DetailedHTMLProps<React.FormHTMLAttributes<T>, T>;
  export type ReactNode = React.ReactNode;
}
