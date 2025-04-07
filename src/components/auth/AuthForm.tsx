
import React from 'react';
import { cn } from '@/lib/utils';

interface AuthFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export const AuthForm = ({ className, children, ...props }: AuthFormProps) => {
  return (
    <form className={cn("space-y-5", className)} {...props}>
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
    <div className="text-center space-y-2 mb-6 animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight text-slate-800">{title}</h1>
      {description && <p className="text-sm text-slate-500">{description}</p>}
    </div>
  );
};

interface AuthFormFooterProps {
  children: React.ReactNode;
}

export const AuthFormFooter = ({ children }: AuthFormFooterProps) => {
  return (
    <div className="flex flex-col gap-3 mt-8 animate-fade-in">
      {children}
    </div>
  );
};

interface AuthDividerProps {
  text?: string;
}

export const AuthDivider = ({ text = "or continue with" }: AuthDividerProps) => {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-3 text-slate-500 font-medium">{text}</span>
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
