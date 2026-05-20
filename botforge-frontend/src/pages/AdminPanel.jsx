import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

// ─── Plan list for dropdowns ────────────────────────────────────
const plans = ['free', 'starter', 'pro', 'agency'];

// ─── Icons (using the same icon components as your Dashboard) ───
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
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M7 15L13 10L7 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Plan colour helper (theme‑aware) ────────────────────────────
const getPlanClasses = (plan, dark) => {
  const map = {
    free:    dark ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-gray-100 text-gray-700 border-gray-200',
    starter: dark ? 'bg-blue-900/60 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200',
    pro:     dark ? 'bg-purple-900/60 text-purple-300 border-purple-500/30' : 'bg-purple-50 text-purple-700 border-purple-200',
    agency:  dark ? 'bg-yellow-900/60 text-yellow-300 border-yellow-500/30' : 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };
  return map[plan] || map.free;
};

// ─── Component ────────────────────────────────────────────────────
export default function AdminPanel() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);
  const [dark, setDark] = useState(true); // theme state
  const [selectedUserId, setSelectedUserId] = useState(null);

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
      if (usersRes.data.data.users.length > 0 && !selectedUserId) {
        setSelectedUserId(usersRes.data.data.users[0].id);
      }
    } catch (err) {
      if (err.response?.status === 403) navigate('/dashboard');
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
      const updated = users.filter(u => u.id !== userId);
      setUsers(updated);
      if (selectedUserId === userId) {
        setSelectedUserId(updated.length > 0 ? updated[0].id : null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedUser = users.find(u => u.id === selectedUserId) || null;

  // Theme helpers (same as Dashboard)
  const d = {
    bg:        dark ? 'bg-gray-950' : 'bg-[#f8f9ff]',
    sidebar:   dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
    header:    dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
    text:      dark ? 'text-white' : 'text-gray-900',
    subtext:   dark ? 'text-gray-400' : 'text-gray-500',
    card:      dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
    hover:     dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
    input:     dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900',
    divider:   dark ? 'border-gray-800' : 'border-gray-100',
  };

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center transition-colors ${d.bg}`}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className={`text-sm font-medium ${d.subtext}`}>Loading admin panel...</span>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${d.bg}`} style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Top Navbar (same style as Dashboard) ── */}
      <header className={`border-b sticky top-0 z-50 ${d.header}`}>
        <nav className="flex items-center justify-between px-6 py-3.5 max-w-full">
          <div className="flex items-center gap-3">
            <BotIcon />
            <span className={`text-xl font-bold tracking-tight ${d.text}`}>BotForge</span>
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

      {/* ── Body (Sidebar + Main) ── */}
      <div className="flex flex-1">

        {/* ── Sidebar (same layout as Dashboard sidebar) ── */}
        <aside className={`w-64 flex-shrink-0 border-r flex flex-col sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto ${d.sidebar}`}>

          {/* Search */}
          <div className="p-4 pb-2">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full border rounded-lg pl-9 pr-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition ${
                  dark
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20'
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
            </div>
            <div className="mt-2 text-xs text-gray-400">{filteredUsers.length} users</div>
          </div>

          {/* Users List */}
          <div className="flex-1 space-y-0.5 px-3 pb-4">
            {filteredUsers.length === 0 ? (
              <p className={`text-xs px-3 py-2 ${d.subtext}`}>No users found</p>
            ) : (
              filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition group ${
                    selectedUserId === user.id
                      ? dark
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-blue-50 text-blue-600'
                      : dark
                        ? 'hover:bg-gray-800 text-gray-300'
                        : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    dark
                      ? 'bg-blue-400/10 border-blue-500/20 text-blue-300'
                      : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-xs truncate">{user.name}</div>
                    <div className={`text-[10px] truncate ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {user.email}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize border ${getPlanClasses(user.plan, dark)}`}>
                        {user.plan}
                      </span>
                      {user.is_admin && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 dark:bg-red-400/10 dark:text-red-400 dark:border-red-500/20">
                          ADMIN
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRightIcon />
                </button>
              ))
            )}
          </div>

          {/* Divider + Admin Panel link (if needed) */}
          <div className={`p-4 border-t ${d.divider}`}>
            <button onClick={() => navigate('/dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}>
              <ShieldIcon /> Back to Dashboard
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0 p-8">

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Users',         value: stats.totalUsers,         color: 'text-blue-600 dark:text-blue-400',         bg: 'bg-blue-50 dark:bg-blue-400/10' },
                { label: 'Total Websites',       value: stats.totalWebsites,       color: 'text-emerald-600 dark:text-emerald-400',   bg: 'bg-emerald-50 dark:bg-emerald-400/10' },
                { label: 'Total Conversations',  value: stats.totalConversations,  color: 'text-purple-600 dark:text-purple-400',     bg: 'bg-purple-50 dark:bg-purple-400/10' },
                { label: 'Paid Users',           value: stats.planCounts?.filter(p => p.plan !== 'free').reduce((a, b) => a + b._count.plan, 0) || 0, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-400/10' },
              ].map(s => (
                <div key={s.label} className={`rounded-xl p-5 flex items-center gap-4 border ${d.card}`}>
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${dark ? s.bg.replace('50','400/10') : s.bg} ${s.color}`}>
                    {/* Could use a relevant icon per stat */}
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${d.text}`}>{s.value}</div>
                    <div className={`text-sm ${d.subtext}`}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* User Detail View */}
          {!selectedUser ? (
            <div className={`border-2 border-dashed rounded-2xl p-16 text-center ${dark ? 'border-gray-800 bg-gray-900/40' : 'border-gray-200 bg-white'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${dark ? 'bg-blue-400/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/>
                </svg>
              </div>
              <h3 className={`font-semibold mb-2 ${d.text}`}>Select a user</h3>
              <p className={`text-sm max-w-xs mx-auto ${d.subtext}`}>Choose a user from the sidebar to view their details.</p>
            </div>
          ) : (
            <div className={`border rounded-2xl overflow-hidden ${d.card}`}>
              {/* User Header */}
              <div className="p-6 border-b dark:border-gray-800 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full border flex items-center justify-center text-xl font-bold ${
                    dark ? 'bg-blue-400/10 border-blue-500/20 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}>
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {selectedUser.name}
                      {selectedUser.is_admin && (
                        <span className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-700 border border-red-200 dark:bg-red-400/10 dark:text-red-400 dark:border-red-500/20">
                          ADMIN
                        </span>
                      )}
                    </h2>
                    <p className={`text-sm ${d.subtext}`}>{selectedUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleAdmin(selectedUser.id, selectedUser.is_admin)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition ${
                      selectedUser.is_admin
                        ? dark ? 'border-red-500/30 text-red-400 hover:bg-red-400/10' : 'border-red-200 text-red-600 hover:bg-red-50'
                        : dark ? 'border-gray-700 text-gray-400 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}>
                    {selectedUser.is_admin ? 'Remove Admin' : 'Make Admin'}
                  </button>
                  <button onClick={() => deleteUser(selectedUser.id)}
                    className={`px-3 py-1.5 text-xs border rounded-lg transition ${
                      dark ? 'border-red-500/30 text-red-400 hover:bg-red-400/10' : 'border-red-200 text-red-500 hover:bg-red-50'
                    }`}>
                    Delete
                  </button>
                </div>
              </div>

              {/* Detail Cards */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className={`p-5 rounded-xl border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Plan</div>
                  <select
                    value={selectedUser.plan}
                    onChange={(e) => changePlan(selectedUser.id, e.target.value)}
                    disabled={updating === selectedUser.id}
                    className={`text-sm font-bold px-3 py-1.5 rounded-lg border cursor-pointer capitalize focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 transition ${getPlanClasses(selectedUser.plan, dark)}`}
                  >
                    {plans.map(p => (
                      <option key={p} value={p} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white capitalize">{p}</option>
                    ))}
                  </select>
                </div>

                <div className={`p-5 rounded-xl border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Websites</div>
                  <div className="text-2xl font-bold">{selectedUser._count?.websites ?? 0}</div>
                </div>

                <div className={`p-5 rounded-xl border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Monthly Chats</div>
                  <div className="text-2xl font-bold">{selectedUser.monthly_conversations ?? 0}</div>
                </div>

                <div className={`p-5 rounded-xl border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Joined</div>
                  <div className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {new Date(selectedUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}