
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
  
  // Enhanced SyntheticEvent with better target typing
  export type SyntheticEvent<T = Element, E = Event> = {
    bubbles: boolean;
    cancelable: boolean;
    currentTarget: EventTarget & T;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    nativeEvent: E;
    preventDefault(): void;
    stopPropagation(): void;
    target: EventTarget & T;
    timeStamp: number;
    type: string;
  };
  
  export type MouseEvent<T = Element> = React.MouseEvent<T>;
  export type DragEvent<T = Element> = React.DragEvent<T>;
  export type RefObject<T> = React.RefObject<T>;
  export type Dispatch<A> = React.Dispatch<A>;
  export type SetStateAction<S> = React.SetStateAction<S>;
  
  // More event types
  export type KeyboardEvent<T = Element> = React.KeyboardEvent<T>;
  export type FocusEvent<T = Element> = React.FocusEvent<T>;
  export type TouchEvent<T = Element> = React.TouchEvent<T>;
  export type WheelEvent<T = Element> = React.WheelEvent<T>;
  export type AnimationEvent<T = Element> = React.AnimationEvent<T>;
  export type TransitionEvent<T = Element> = React.TransitionEvent<T>;
  export type ClipboardEvent<T = Element> = React.ClipboardEvent<T>;
  export type CompositionEvent<T = Element> = React.CompositionEvent<T>;
  
  // HTML attributes with enhanced support for onClick, id, and other common props
  export interface HTMLAttributes<T> extends React.HTMLAttributes<T> {
    onClick?: (event: MouseEvent<T>) => void;
    id?: string;
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
    children?: React.ReactNode;
    className?: string;
  }
  
  export interface TableRowHTMLAttributes<T> extends HTMLAttributes<T> {
    onClick?: (event: MouseEvent<T>) => void;
    children?: React.ReactNode;
    className?: string;
  }
  
  export interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
    onClick?: (event: MouseEvent<T>) => void;
    colSpan?: number;
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
    colSpan?: number;
    rowSpan?: number;
    scope?: string;
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface ButtonHTMLAttributes<T> extends React.ButtonHTMLAttributes<T> {}
  export interface InputHTMLAttributes<T> extends React.InputHTMLAttributes<T> {}
  export interface TextareaHTMLAttributes<T> extends React.TextareaHTMLAttributes<T> {}
  export interface SelectHTMLAttributes<T> extends React.SelectHTMLAttributes<T> {}
  export interface OptionHTMLAttributes<T> extends React.OptionHTMLAttributes<T> {}
  export interface AnchorHTMLAttributes<T> extends React.AnchorHTMLAttributes<T> {}
  export interface ImgHTMLAttributes<T> extends React.ImgHTMLAttributes<T> {}
  export interface LabelHTMLAttributes<T> extends React.LabelHTMLAttributes<T> {}
  
  // Component props types
  export type DetailedHTMLProps<E extends HTMLAttributes<T>, T> = React.DetailedHTMLProps<E, T>;
  export type ComponentProps<T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> = React.ComponentProps<T>;
  export type ComponentPropsWithRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>;
  export type ComponentPropsWithoutRef<T extends React.ElementType> = React.ComponentPropsWithoutRef<T>;
  export type ElementRef<T extends React.ElementType> = React.ElementRef<T>;
  
  // Misc types
  export type ReactNode = React.ReactNode;
  export type ReactElement = React.ReactElement;
  export type ComponentType<P = {}> = React.ComponentType<P>;
  export type FormEventHandler<T = Element> = (event: FormEvent<T>) => void;
  export type ChangeEventHandler<T = Element> = (event: ChangeEvent<T>) => void;
  export type MouseEventHandler<T = Element> = (event: MouseEvent<T>) => void;
  export type DragEventHandler<T = Element> = (event: DragEvent<T>) => void;
  export type KeyboardEventHandler<T = Element> = (event: KeyboardEvent<T>) => void;
  export const memo: typeof React.memo;
  export const Fragment: typeof React.Fragment;
  export const forwardRef: typeof React.forwardRef;
  export const createRef: typeof React.createRef;
  export const createContext: typeof React.createContext;
  export const useId: typeof React.useId;
  
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
