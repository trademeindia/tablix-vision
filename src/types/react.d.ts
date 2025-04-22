
import 'react';

declare module 'react' {
  // Component types
  export interface FC<P = {}> {
    (props: P, context?: any): React.ReactElement<any, any> | null;
    displayName?: string;
    defaultProps?: Partial<P>;
  }

  // Event types
  export type FormEvent<T = Element> = React.SyntheticEvent<T, Event>;
  export type ChangeEvent<T = Element> = React.SyntheticEvent<T, Event>;
  export type FormHTMLAttributes<T> = React.DetailedHTMLProps<React.FormHTMLAttributes<T>, T>;
  export type SyntheticEvent<T = Element, E = Event> = React.SyntheticEvent<T, E>;
  export type MouseEvent<T = Element> = React.MouseEvent<T>;
  export type RefObject<T> = React.RefObject<T>;
  export type Dispatch<A> = React.Dispatch<A>;
  export type SetStateAction<S> = React.SetStateAction<S>;
  
  // Misc types
  export type ReactNode = React.ReactNode;
  export type FormEventHandler<T = Element> = (event: FormEvent<T>) => void;
  export const memo: typeof React.memo;
  
  // Hooks
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useContext: typeof React.useContext;
  export const useReducer: typeof React.useReducer;
  export const useCallback: typeof React.useCallback;
  export const useMemo: typeof React.useMemo;
  export const useRef: typeof React.useRef;
  export const useImperativeHandle: typeof React.useImperativeHandle;
  export const useLayoutEffect: typeof React.useLayoutEffect;
  export const useDebugValue: typeof React.useDebugValue;
  
  // Suspense related
  export const Suspense: typeof React.Suspense;
  export const lazy: typeof React.lazy;
}
