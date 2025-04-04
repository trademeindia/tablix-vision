
import React from 'react';
import AuthTabs from '@/components/auth/AuthTabs';

interface RoleTabsSectionProps {
  role: string;
  handleRoleChange: (newRole: string) => void;
}

const RoleTabsSection: React.FC<RoleTabsSectionProps> = ({ role, handleRoleChange }) => {
  return <AuthTabs defaultRole={role} onChange={handleRoleChange} />;
};

export default RoleTabsSection;
