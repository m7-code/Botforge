import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const plans = ['free', 'starter', 'pro', 'agency'];

const planColors = {
  free:    'bg-gray-700 text-gray-300',
  starter: 'bg-blue-900 text-blue-300',
  pro:     'bg-purple-900 text-purple-300',
  agency:  'bg-yellow-900 text-yellow-300',
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/stats'),
      ]);
      setUsers(usersRes.data.data.users);
      setStats(statsRes.data.data);
    } catch (err) {
      if (err.response?.status === 403) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const changePlan = async (userId, plan) => {
    setUpdating(userId);
    try {
      await API.patch(`/admin/users/${userId}/plan`, { plan });
      setUsers(users.map(u => u.id === userId ? { ...u, plan } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    } finally {
      setUpdating(null);
    }
  };

  const toggleAdmin = async (userId, currentStatus) => {
    if (!confirm(`${currentStatus ? 'Remove' : 'Make'} this user admin?`)) return;
    try {
      await API.patch(`/admin/users/${userId}/admin`, { is_admin: !currentStatus });
      setUsers(users.map(u => u.id === userId ? { ...u, is_admin: !currentStatus } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-blue-500">🤖 BotForge</span>
          <span className="px-2 py-0.5 bg-red-900/50 border border-red-700 text-red-400 text-xs font-bold rounded">
            ADMIN
          </span>
        </div>
        <button onClick={() => navigate('/dashboard')}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg transition">
          ← Dashboard
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Total Users',         value: stats.totalUsers,         color: 'text-blue-400' },
              { label: 'Total Websites',       value: stats.totalWebsites,       color: 'text-green-400' },
              { label: 'Total Conversations',  value: stats.totalConversations,  color: 'text-purple-400' },
              { label: 'Paid Users',           value: stats.planCounts?.filter(p => p.plan !== 'free').reduce((a, b) => a + b._count.plan, 0) || 0, color: 'text-yellow-400' },
            ].map(s => (
              <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
                <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
                <div className="text-gray-500 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <span className="text-gray-400 text-sm">{filtered.length} users</span>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-6 text-sm"
        />

        {/* Users Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-6 py-4 text-sm text-gray-400 font-medium">User</th>
                <th className="px-6 py-4 text-sm text-gray-400 font-medium">Plan</th>
                <th className="px-6 py-4 text-sm text-gray-400 font-medium">Websites</th>
                <th className="px-6 py-4 text-sm text-gray-400 font-medium">Chats</th>
                <th className="px-6 py-4 text-sm text-gray-400 font-medium">Joined</th>
                <th className="px-6 py-4 text-sm text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">

                  {/* User info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-900/50 border border-blue-800 flex items-center justify-center text-sm font-bold text-blue-300">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm flex items-center gap-2">
                          {user.name}
                          {user.is_admin && (
                            <span className="px-1.5 py-0.5 bg-red-900/40 border border-red-800 text-red-400 text-xs rounded">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className="text-gray-500 text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Plan dropdown */}
                  <td className="px-6 py-4">
                    <select
                      value={user.plan}
                      onChange={(e) => changePlan(user.id, e.target.value)}
                      disabled={updating === user.id}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer capitalize focus:outline-none focus:ring-1 focus:ring-blue-500 ${planColors[user.plan]}`}>
                      {plans.map(p => (
                        <option key={p} value={p} className="bg-gray-800 text-white capitalize">{p}</option>
                      ))}
                    </select>
                  </td>

                  {/* Websites count */}
                  <td className="px-6 py-4">
                    <span className="text-gray-300 text-sm">{user._count.websites}</span>
                  </td>

                  {/* Conversations */}
                  <td className="px-6 py-4">
                    <span className="text-gray-300 text-sm">{user.monthly_conversations}</span>
                  </td>

                  {/* Joined date */}
                  <td className="px-6 py-4">
                    <span className="text-gray-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAdmin(user.id, user.is_admin)}
                        className={`px-2 py-1 text-xs rounded-lg border transition ${
                          user.is_admin
                            ? 'border-red-800 text-red-400 hover:bg-red-900/30'
                            : 'border-gray-700 text-gray-400 hover:bg-gray-700'
                        }`}>
                        {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-2 py-1 text-xs border border-red-900 text-red-500 rounded-lg hover:bg-red-900/30 transition">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
}