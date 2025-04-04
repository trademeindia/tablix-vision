
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
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
      <Input
        id={id}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        className="pr-10"
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </InputIconWrapper>
  );
};

export default PasswordInput;
