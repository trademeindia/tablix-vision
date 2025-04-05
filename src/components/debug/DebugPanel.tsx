
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DebugPanel: React.FC = () => {
  const { user, userRoles, loading } = useAuth();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Press Ctrl+Shift+D to toggle debug panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 p-4 bg-black/80 text-white rounded-tr-lg text-xs w-80 max-h-96 overflow-auto">
      <h3 className="font-bold mb-2">Debug Info (Press Ctrl+Shift+D to hide)</h3>
      <div className="space-y-2">
        <p><strong>Current Path:</strong> {location.pathname}</p>
        <p><strong>Auth Status:</strong> {loading ? 'Loading' : user ? 'Authenticated' : 'Not Authenticated'}</p>
        {user && (
          <>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Roles:</strong> {userRoles.join(', ') || 'None'}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default DebugPanel;
