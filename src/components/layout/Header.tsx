
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { Loader2, LogOut, LogIn } from 'lucide-react';

const Header = () => {
  const { isLoading, isAuthenticated, user, signOut } = useAuthStatus();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="h-16 bg-white shadow border-b px-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold">
          Restaurant Manager
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden md:inline-block">Sign Out</span>
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link to="/auth">
              <LogIn className="h-4 w-4 mr-2" />
              <span>Sign In</span>
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
