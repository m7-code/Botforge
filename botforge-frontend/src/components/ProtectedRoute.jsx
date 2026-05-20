import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;

  if (adminOnly) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = [true, 'true', 1, '1'].includes(user.is_admin);
    if (!isAdmin) return <Navigate to="/dashboard" />;
  }

  return children;
}