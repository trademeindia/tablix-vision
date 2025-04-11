
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthTabsProps {
  defaultRole: string;
  onChange?: (value: string) => void;
}

const AuthTabs = ({ defaultRole, onChange }: AuthTabsProps) => {
  return (
    <Tabs defaultValue={defaultRole} className="w-full" onValueChange={onChange}>
      <TabsList className="grid w-full grid-cols-4 mb-4">
        <TabsTrigger value="owner">Owner</TabsTrigger>
        <TabsTrigger value="manager">Manager</TabsTrigger>
        <TabsTrigger value="waiter">Waiter</TabsTrigger>
        <TabsTrigger value="chef">Kitchen</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default AuthTabs;
