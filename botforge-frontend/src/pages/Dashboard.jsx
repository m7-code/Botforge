import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getWebsites, addWebsite, deleteWebsite, recrawlWebsite, getMe } from '../services/api';

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

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3.5 8H20.5M3.5 16H20.5" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
  </svg>
);

const ChipIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 3V7M12 3V7M15 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 17V21M12 17V21M15 17V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 9H7M3 12H7M3 15H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 9H21M17 12H21M17 15H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DocIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M4 4C4 2.89543 4.89543 2 6 2H13L20 9V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M13 2V9H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 13H16M8 17H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M20 10C20 6.13401 16.866 3 13 3C9.13401 3 6 6.13401 6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 10H8V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 14C4 17.866 7.13401 21 11 21C14.866 21 18 17.866 18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 14H16V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M3 6H21M8 6V4H16V6M19 6L18 20C18 21.1046 17.1046 22 16 22H8C6.89543 22 6 21.1046 6 20L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17L21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ─── Status Config ─────────────────────────────────────────────────────────────

const STATUS = {
  pending:  { dot: 'bg-amber-400',  badge: 'bg-amber-50 text-amber-700 border-amber-200',    label: 'Pending'  },
  crawling: { dot: 'bg-blue-500',   badge: 'bg-blue-50 text-blue-700 border-blue-200',        label: 'Crawling' },
  ready:    { dot: 'bg-emerald-500',badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',label: 'Ready'   },
  failed:   { dot: 'bg-red-500',    badge: 'bg-red-50 text-red-700 border-red-200',            label: 'Failed'  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState([]);
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl]   = useState('');
  const [adding, setAdding]   = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [webRes, userRes] = await Promise.all([getWebsites(), getMe()]);
      setWebsites(webRes.data.data.websites);
      setUser(userRes.data.data.user);
      localStorage.setItem('user', JSON.stringify(userRes.data.data.user));
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true); setError('');
    try {
      await addWebsite({ url: newUrl });
      setNewUrl(''); setShowAdd(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add website');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault(); e.stopPropagation();
    if (!confirm('Delete this website and all its data?')) return;
    await deleteWebsite(id); fetchData();
  };

  const handleRecrawl = async (e, id) => {
    e.preventDefault(); e.stopPropagation();
    await recrawlWebsite(id); fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"/>
        <span className="text-sm text-gray-400 font-medium">Loading workspace...</span>
      </div>
    </div>
  );

  const totalPages = websites.reduce((a, w) => a + (w.pages_crawled || 0), 0);
  const activeBots = websites.filter(w => w.status === 'ready').length;

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Navbar ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav className="flex items-center justify-between px-8 py-3.5 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <BotIcon />
            <span className="font-bold text-lg text-gray-900 tracking-tight">BotForge</span>
          </div>

          <div className="flex items-center gap-3">
            {user?.is_admin && (
              <Link to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition">
                <ShieldIcon /> Admin Panel
              </Link>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              <span className="px-1.5 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded capitalize">
                {user?.plan}
              </span>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <LogoutIcon /> Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">My Websites</h1>
            <p className="text-sm text-gray-500">{websites.length} site{websites.length !== 1 ? 's' : ''} in your workspace</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition active:scale-95">
            <PlusIcon /> Add Website
          </button>
        </div>

        {/* ── Stats Bento ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Websites', value: websites.length,  Icon: GlobeIcon,  color: 'text-blue-600',    bg: 'bg-blue-50' },
            { label: 'Active Bots',    value: activeBots,        Icon: ChipIcon,   color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Pages Crawled',  value: totalPages,        Icon: DocIcon,    color: 'text-violet-600',  bg: 'bg-violet-50' },
          ].map(({ label, value, Icon, color, bg }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-blue-200 transition-colors">
              <div className={`w-11 h-11 rounded-lg ${bg} flex items-center justify-center ${color}`}>
                <Icon />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Websites List ── */}
        {websites.length === 0 ? (

          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
              <GlobeIcon />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No websites yet</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
              Add your first website and our AI will crawl it and build a smart chatbot knowledge base.
            </p>
            <button onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition">
              <PlusIcon /> Add Your First Website
            </button>
          </div>

        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

            {/* Table Header */}
            <div className="grid grid-cols-12 px-6 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="col-span-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Website</div>
              <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</div>
              <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pages</div>
              <div className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</div>
            </div>

            {/* Rows */}
            {websites.map((site, i) => {
              const st = STATUS[site.status] || STATUS.pending;
              return (
                <Link to={`/websites/${site.id}`} key={site.id}
                  className={`grid grid-cols-12 px-6 py-4 items-center hover:bg-blue-50/40 transition-colors group ${i < websites.length - 1 ? 'border-b border-gray-100' : ''}`}>

                  {/* Name + URL */}
                  <div className="col-span-5 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${st.dot} ${site.status === 'crawling' ? 'animate-pulse' : ''}`}/>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {site.name || site.url}
                      </div>
                      <div className="text-xs text-gray-400 truncate">{site.url}</div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold border rounded-full ${st.badge}`}>
                      {st.label}
                    </span>
                  </div>

                  {/* Pages */}
                  <div className="col-span-2 text-sm text-gray-600 font-medium">
                    {site.pages_crawled} <span className="text-gray-400 font-normal">pages</span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleRecrawl(e, site.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition">
                      <RefreshIcon /> Recrawl
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, site.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition">
                      <TrashIcon />
                    </button>
                    <div className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600">
                      <ArrowRightIcon />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Add Modal ── */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <PlusIcon />
                </div>
                <h2 className="font-semibold text-gray-900">Add New Website</h2>
              </div>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600 transition">
                <XIcon />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Website URL</label>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition">
                    <GlobeIcon />
                    <input
                      type="url"
                      required
                      placeholder="https://example.com"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="flex-1 py-3 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">We'll crawl up to 100 pages automatically</p>
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowAdd(false)}
                    className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={adding}
                    className="flex-1 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                    {adding ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Adding...</>
                    ) : (
                      <>Add Website <ArrowRightIcon /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}