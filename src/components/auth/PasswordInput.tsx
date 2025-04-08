
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { InputIconWrapper } from '@/components/auth/AuthForm';

interface PasswordInputProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minLength?: number;
  required?: boolean;
}

const PasswordInput = ({
  id,
  placeholder,
  value,
  onChange,
  minLength,
  required = false
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <InputIconWrapper>
      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        id={id}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        className="pl-10 pr-10 bg-white transition-all border-slate-300 focus-visible:border-primary/70"
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        autoComplete="current-password"
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </InputIconWrapper>
  );
};

export default PasswordInput;
