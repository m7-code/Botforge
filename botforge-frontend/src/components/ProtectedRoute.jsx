import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem('token');
  
  if (!token) return <Navigate to="/login" />;
  
  // Admin check — localStorage mein user save karenge
  if (adminOnly) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.is_admin) return <Navigate to="/dashboard" />;
  }
  
  return children;
}