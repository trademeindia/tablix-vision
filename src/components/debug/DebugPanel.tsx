
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const DebugPanel: React.FC = () => {
  const { user, userRoles, loading } = useAuth();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
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

  // Track global errors
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      setErrors(prev => [...prev, `${event.message} at ${event.filename}:${event.lineno}`]);
    };
    
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (!isVisible) return null;

  // Test Supabase connection
  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('test').select('*').limit(1);
      if (error) throw error;
      alert(`Supabase connection successful!`);
    } catch (error) {
      alert(`Supabase error: ${error.message}`);
    }
  };

  // Clear session data
  const clearSession = () => {
    localStorage.clear();
    window.location.reload();
  };

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

        {errors.length > 0 && (
          <div className="mt-2">
            <p className="font-bold text-red-400">Errors:</p>
            <ul className="list-disc pl-4">
              {errors.map((error, i) => (
                <li key={i} className="text-red-300">{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button 
            onClick={testSupabaseConnection}
            className="px-2 py-1 bg-blue-600 rounded text-xs"
          >
            Test Supabase
          </button>
          <button 
            onClick={clearSession}
            className="px-2 py-1 bg-red-600 rounded text-xs"
          >
            Clear Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
