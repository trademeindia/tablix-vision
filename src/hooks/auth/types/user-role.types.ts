
// Define the possible user roles as a union type
export type UserRole = 'owner' | 'manager' | 'chef' | 'waiter' | 'staff' | 'customer';

export interface UseUserRoleReturn {
  userRoles: UserRole[];
  fetchUserRoles: (userId: string) => Promise<UserRole[]>;
  loading: boolean;
  error: Error | null;
}
