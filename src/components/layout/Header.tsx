
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="h-16 bg-white shadow border-b px-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold">
          Restaurant Manager
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Restaurant Dashboard
        </span>
      </div>
    </header>
  );
};

export default Header;
