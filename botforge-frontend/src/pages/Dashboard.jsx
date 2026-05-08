import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getWebsites, addWebsite, deleteWebsite, recrawlWebsite, getMe } from '../services/api';

// ─── Custom SVG Icons ─────────────────────────────────────────────────────────

const BotIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <rect x="8" y="14" width="32" height="26" rx="8" fill="rgba(59,130,246,0.15)" stroke="#3B82F6" strokeWidth="2"/>
    <circle cx="18" cy="26" r="4" fill="#3B82F6"/>
    <circle cx="30" cy="26" r="4" fill="#3B82F6"/>
    <circle cx="18" cy="26" r="2" fill="#93C5FD"/>
    <circle cx="30" cy="26" r="2" fill="#93C5FD"/>
    <path d="M19 34 Q24 38 29 34" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 14 L24 8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="24" cy="6" r="2.5" fill="#60A5FA"/>
    <path d="M10 28 L4 28" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
    <path d="M44 28 L38 28" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="3" cy="28" r="2" fill="#60A5FA"/>
    <circle cx="45" cy="28" r="2" fill="#60A5FA"/>
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <defs>
      <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.05"/>
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="28" stroke="#3B82F6" strokeWidth="2" fill="url(#globeGrad)"/>
    <ellipse cx="32" cy="32" rx="12" ry="28" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4"/>
    <ellipse cx="32" cy="32" rx="28" ry="12" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4"/>
    <line x1="4" y1="32" x2="60" y2="32" stroke="#3B82F6" strokeWidth="1.5" opacity="0.3"/>
    <line x1="32" y1="4" x2="32" y2="60" stroke="#3B82F6" strokeWidth="1.5" opacity="0.3"/>
    <circle cx="32" cy="32" r="4" fill="#60A5FA"/>
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RecrawlIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C12.5 3 14.7 4.3 15.8 6.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15 3V7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M3 5H17M7 5V3C7 2.44772 7.44772 2 8 2H12C12.5523 2 13 2.44772 13 3V5M8 8V15M12 8V15M5 5V17C5 17.5523 5.44772 18 6 18H14C14.5523 18 15 17.5523 15 17V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0">
    <circle cx="10" cy="10" r="9" fill="rgba(59,130,246,0.15)" stroke="#3B82F6" strokeWidth="1.5"/>
    <path d="M6 10L9 13L14 7" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-400">
    <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z" stroke="currentColor" strokeWidth="2" fill="rgba(59,130,246,0.1)" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-400">
    <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" stroke="currentColor" strokeWidth="2" fill="rgba(59,130,246,0.1)" strokeLinejoin="round"/>
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PageIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
    <path d="M4 4C4 2.89543 4.89543 2 6 2H10L16 8V16C16 17.1046 15.1046 18 14 18H6C4.89543 18 4 17.1046 4 16V4Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 2V8H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BotIdIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
    <rect x="3" y="7" width="14" height="6" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="6" cy="10" r="1" fill="currentColor"/>
    <circle cx="10" cy="10" r="1" fill="currentColor"/>
    <circle cx="14" cy="10" r="1" fill="currentColor"/>
  </svg>
);

const StatusIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.5"/>
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [webRes, userRes] = await Promise.all([getWebsites(), getMe()]);
      setWebsites(webRes.data.data.websites);
      setUser(userRes.data.data.user);
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');
    try {
      await addWebsite({ url: newUrl });
      setNewUrl('');
      setShowAdd(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add website');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this website?')) return;
    await deleteWebsite(id);
    fetchData();
  };

  const handleRecrawl = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    await recrawlWebsite(id);
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const statusConfig = {
    pending: { color: 'bg-yellow-500', label: 'Pending', bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    crawling: { color: 'bg-blue-500', label: 'Crawling', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    ready: { color: 'bg-green-500', label: 'Ready', bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
    failed: { color: 'bg-red-500', label: 'Failed', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
        <div className="text-gray-400 text-sm">Loading your dashboard...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800/60 sticky top-0 bg-gray-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2.5">
          <BotIcon />
          <span className="text-xl font-bold text-white">BotForge</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"/>
            {user?.name}
            <span className="px-2 py-0.5 bg-blue-950/60 border border-blue-800/40 rounded-full text-blue-400 text-xs capitalize">
              {user?.plan}
            </span>
          </span>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg transition">
            <LogoutIcon />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Websites</h1>
            <p className="text-gray-500 text-sm">
              {websites.length} website{websites.length !== 1 ? 's' : ''} in your workspace
            </p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <PlusIcon />
            Add Website
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Websites', value: websites.length, icon: GlobeIcon, color: 'from-blue-500/20 to-blue-600/10' },
            { label: 'Active Bots', value: websites.filter(w => w.status === 'ready').length, icon: BotIcon, color: 'from-green-500/20 to-emerald-600/10' },
            { label: 'Pages Crawled', value: websites.reduce((acc, w) => acc + (w.pages_crawled || 0), 0), icon: PageIcon, color: 'from-purple-500/20 to-violet-600/10' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 flex items-center gap-4 hover:border-gray-700 transition-colors">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Website Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 rounded-3xl p-8 w-full max-w-md border border-gray-800 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/40 flex items-center justify-center">
                  <PlusIcon />
                </div>
                <h2 className="text-xl font-bold">Add New Website</h2>
              </div>
              {error && (
                <div className="bg-red-950/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"/>
                  {error}
                </div>
              )}
              <form onSubmit={handleAdd} className="space-y-5">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block font-medium">Website URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowAdd(false)}
                    className="flex-1 py-3.5 border border-gray-700 rounded-xl hover:bg-gray-800 transition font-medium">
                    Cancel
                  </button>
                  <button type="submit" disabled={adding}
                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {adding ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                        Adding...
                      </>
                    ) : (
                      <>
                        Add Website <ArrowIcon />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Websites List */}
        {websites.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-800 rounded-3xl bg-gray-900/20">
            <div className="flex justify-center mb-6">
              <GlobeIcon />
            </div>
            <h3 className="text-xl font-semibold mb-2">No websites yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Add your first website and let our AI crawl and build a smart knowledge base for your chatbot.</p>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] mx-auto">
              <PlusIcon />
              Add Your First Website
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {websites.map((site) => {
              const status = statusConfig[site.status] || statusConfig.pending;
              return (
                <Link to={`/websites/${site.id}`} key={site.id}
                  className="group bg-gray-900/40 border border-gray-800 hover:border-blue-800/50 rounded-2xl p-6 flex items-center justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.07)] hover:-translate-y-0.5 block">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full ${site.status === 'crawling' ? 'animate-pulse' : ''}`}>
                        <div className={`w-full h-full rounded-full ${status.color}`}/>
                      </div>
                      <div className={`absolute inset-0 w-3 h-3 rounded-full ${status.color} animate-ping opacity-30 ${site.status === 'crawling' ? '' : 'hidden'}`}/>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{site.name || site.url}</h3>
                      <p className="text-gray-500 text-sm">{site.url}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${status.bg} ${status.text} ${status.border}`}>
                          <StatusIcon />
                          {status.label}
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <PageIcon />
                          {site.pages_crawled} pages
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <BotIdIcon />
                          {site.bot_id?.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleRecrawl(e, site.id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-700 hover:border-blue-600 hover:text-blue-400 rounded-xl hover:bg-blue-950/30 transition-all"
                      title="Recrawl website">
                      <RecrawlIcon />
                      <span className="hidden sm:inline">Recrawl</span>
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, site.id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm border border-red-900/50 text-red-400 hover:bg-red-950/30 rounded-xl transition-all"
                      title="Delete website">
                      <TrashIcon />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}