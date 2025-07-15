import { useState, useEffect } from 'react';
import { NotFound } from '../../pages';

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/permissions/admin', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin && data.isValidToken);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!isAdmin) {
    return <NotFound />;
  }

  return children;
};

export default AdminRoute;