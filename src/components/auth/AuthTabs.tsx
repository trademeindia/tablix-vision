
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthTabsProps {
  defaultRole: string;
  onChange?: (value: string) => void;
}

const AuthTabs = ({ defaultRole, onChange }: AuthTabsProps) => {
  return (
    <Tabs defaultValue={defaultRole} className="w-full" onValueChange={onChange}>
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="customer">Customer</TabsTrigger>
        <TabsTrigger value="staff">Staff</TabsTrigger>
        <TabsTrigger value="owner">Owner</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default AuthTabs;
