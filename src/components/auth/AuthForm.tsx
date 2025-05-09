
import * as React from 'react';
import { cn } from '@/lib/utils';

interface AuthFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  className?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

export const AuthForm = ({ className, children, ...props }: AuthFormProps) => {
  return (
    <form className={cn("space-y-4", className)} {...props}>
      {children}
    </form>
  );
};

interface AuthFormHeaderProps {
  title: string;
  description?: string;
}

export const AuthFormHeader = ({ title, description }: AuthFormHeaderProps) => {
  return (
    <div className="text-center space-y-1 mb-4 sm:mb-6">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h1>
      {description && <p className="text-sm text-slate-600 px-2">{description}</p>}
    </div>
  );
};

interface AuthFormFooterProps {
  children: React.ReactNode;
}

export const AuthFormFooter = ({ children }: AuthFormFooterProps) => {
  return (
    <div className="flex flex-col gap-3">
      {children}
    </div>
  );
};

interface AuthDividerProps {
  text?: string;
}

export const AuthDivider = ({ text = "or continue with" }: AuthDividerProps) => {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200"></div>
      </div>
      <div className="relative flex justify-center text-xs sm:text-sm">
        <span className="bg-white px-2 text-slate-500">{text}</span>
      </div>
    </div>
  );
};

interface InputGroupProps {
  children: React.ReactNode;
}

export const InputGroup = ({ children }: InputGroupProps) => {
  return (
    <div className="space-y-2">
      {children}
    </div>
  );
};

interface InputIconWrapperProps {
  children: React.ReactNode;
}

export const InputIconWrapper = ({ children }: InputIconWrapperProps) => {
  return (
    <div className="relative">
      {children}
    </div>
  );
};

export default { AuthForm, AuthFormHeader, AuthFormFooter, AuthDivider, InputGroup, InputIconWrapper };
