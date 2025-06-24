import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const LogoutButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
    localStorage.removeItem('user');
    setLoading(false);
    window.location.href = '/auth';
  };

  return (
    <button onClick={handleLogout} disabled={loading} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2">
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default LogoutButton; 