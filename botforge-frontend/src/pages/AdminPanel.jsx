import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

// ─── Plan list (required for dropdowns) ──────────────────────────────────────
const plans = ['free', 'starter', 'pro', 'agency'];

// ─── Icons ────────────────────────────────────────────────────────────────────
const BotIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <rect x="5" y="9" width="22" height="18" rx="6" fill="rgba(0,80,204,0.12)" stroke="#0050cc" strokeWidth="1.5"/>
    <circle cx="12" cy="17" r="2.5" fill="#0050cc"/>
    <circle cx="20" cy="17" r="2.5" fill="#0050cc"/>
    <circle cx="12" cy="17" r="1" fill="#dae1ff"/>
    <circle cx="20" cy="17" r="1" fill="#dae1ff"/>
    <path d="M13 22 Q16 24.5 19 22" stroke="#0050cc" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 9V5" stroke="#0050cc" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="16" cy="4" r="1.5" fill="#0050cc"/>
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5">
    <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Plan colour helper (theme‑aware) ────────────────────────────────────────
const getPlanClasses = (plan, dark) => {
  const map = {
    free:    dark ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-gray-100 text-gray-700 border-gray-200',
    starter: dark ? 'bg-blue-900/60 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200',
    pro:     dark ? 'bg-purple-900/60 text-purple-300 border-purple-500/30' : 'bg-purple-50 text-purple-700 border-purple-200',
    agency:  dark ? 'bg-yellow-900/60 text-yellow-300 border-yellow-500/30' : 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };
  return map[plan] || map.free;
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);
  const [dark, setDark] = useState(false); // theme state

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
    <div className={`min-h-screen flex items-center justify-center transition-colors ${dark ? 'bg-gray-950' : 'bg-[#f8f9ff]'}`}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"/>
        <span className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Loading admin panel...</span>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-gray-950 text-white' : 'bg-[#f8f9ff] text-gray-900'}`} style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Navbar ── */}
      <header className={`border-b sticky top-0 z-50 transition-colors ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <nav className="flex items-center justify-between px-8 py-3.5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <BotIcon />
            <span className={`text-xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>BotForge</span>
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-red-100 text-red-700 border border-red-200 dark:bg-red-400/10 dark:text-red-400 dark:border-red-500/20">
              ADMIN
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-full transition ${dark ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Toggle dark mode"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button onClick={() => navigate('/dashboard')}
              className={`px-4 py-2 text-sm border rounded-lg transition ${
                dark
                  ? 'text-gray-400 border-gray-700 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 border-gray-200 hover:text-gray-900 hover:bg-gray-50'
              }`}>
              ← Dashboard
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">

        {/* ── Stats Cards ── */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Total Users',         value: stats.totalUsers,         color: 'text-blue-600 dark:text-blue-400',         bg: 'bg-blue-50 dark:bg-blue-400/10' },
              { label: 'Total Websites',       value: stats.totalWebsites,       color: 'text-emerald-600 dark:text-emerald-400',   bg: 'bg-emerald-50 dark:bg-emerald-400/10' },
              { label: 'Total Conversations',  value: stats.totalConversations,  color: 'text-purple-600 dark:text-purple-400',     bg: 'bg-purple-50 dark:bg-purple-400/10' },
              { label: 'Paid Users',           value: stats.planCounts?.filter(p => p.plan !== 'free').reduce((a, b) => a + b._count.plan, 0) || 0, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-400/10' },
            ].map(s => (
              <div key={s.label} className={`border rounded-2xl p-6 text-center transition-colors ${
                dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
              }`}>
                <div className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</div>
                <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── User Management Header ── */}
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>User Management</h1>
          <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{filtered.length} users</span>
        </div>

        {/* ── Search ── */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full border rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition mb-6 ${
            dark
              ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20'
              : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
          }`}
        />

        {/* ── Users Table ── */}
        <div className={`border rounded-2xl overflow-hidden transition-colors ${
          dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <table className="w-full">
            <thead>
              <tr className={`border-b ${dark ? 'border-gray-800' : 'border-gray-100'} text-left`}>
                {['User', 'Plan', 'Websites', 'Chats', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className={`border-b transition-colors ${
                  dark ? 'border-gray-800/50 hover:bg-gray-800/30' : 'border-gray-100 hover:bg-blue-50/40'
                }`}>

                  {/* User info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm font-bold ${
                        dark
                          ? 'bg-blue-400/10 border-blue-500/20 text-blue-300'
                          : 'bg-blue-50 border-blue-200 text-blue-700'
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm flex items-center gap-2">
                          {user.name}
                          {user.is_admin && (
                            <span className="px-1.5 py-0.5 text-xs rounded bg-red-100 text-red-700 border border-red-200 dark:bg-red-400/10 dark:text-red-400 dark:border-red-500/20">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Plan dropdown */}
                  <td className="px-6 py-4">
                    <select
                      value={user.plan}
                      onChange={(e) => changePlan(user.id, e.target.value)}
                      disabled={updating === user.id}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer capitalize focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 transition ${
                        getPlanClasses(user.plan, dark)
                      }`}
                    >
                      {plans.map(p => (
                        <option key={p} value={p} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white capitalize">{p}</option>
                      ))}
                    </select>
                  </td>

                  {/* Websites count */}
                  <td className="px-6 py-4">
                    <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{user._count.websites}</span>
                  </td>

                  {/* Conversations */}
                  <td className="px-6 py-4">
                    <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{user.monthly_conversations}</span>
                  </td>

                  {/* Joined date */}
                  <td className="px-6 py-4">
                    <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
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
                            ? dark
                              ? 'border-red-500/30 text-red-400 hover:bg-red-400/10'
                              : 'border-red-200 text-red-600 hover:bg-red-50'
                            : dark
                              ? 'border-gray-700 text-gray-400 hover:bg-gray-700'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className={`px-2 py-1 text-xs border rounded-lg transition ${
                          dark
                            ? 'border-red-500/30 text-red-400 hover:bg-red-400/10'
                            : 'border-red-200 text-red-500 hover:bg-red-50'
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className={`text-center py-12 text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              No users found
            </div>
          )}
        </div>
      </main>
    </div>
  );
}