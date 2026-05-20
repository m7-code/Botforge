import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getWebsite, recrawlWebsite, deleteWebsite } from '../services/api';
import API from '../services/api';

// ─── Custom SVG Icons ─────────────────────────────────────────────────────────
// (all icons remain the same, just adjust container backgrounds if needed)
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

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M19 12H5M5 12L11 6M5 12L11 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.5 2.5H17.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.33337 11.6667L17.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

const CopyIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <rect x="6" y="3" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 7H3C2.44772 7 2 7.44772 2 8V17C2 17.5523 2.44772 18 3 18H12C12.5523 18 13 17.5523 13 17V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" fill="rgba(59,130,246,0.1)"/>
    <path d="M8 14L11 11L14 13L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18" cy="9" r="2" fill="currentColor"/>
  </svg>
);

const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" fill="rgba(34,197,94,0.1)" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const StatusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="rgba(168,85,247,0.1)"/>
    <circle cx="12" cy="12" r="4" fill="currentColor"/>
  </svg>
);

const PageIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M4 4C4 2.89543 4.89543 2 6 2H10L16 8V16C16 17.1046 15.1046 18 14 18H6C4.89543 18 4 17.1046 4 16V4Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 2V8H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2" fill="rgba(59,130,246,0.1)"/>
    <path d="M9 9L6 12L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 9L18 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 6V6.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 10V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ChunkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const WordIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M4 7V17C4 18.1046 4.89543 19 6 19H18C19.1046 19 20 18.1046 20 17V9C20 7.89543 19.1046 7 18 7H12L10 4H6C4.89543 4 4 4.89543 4 6V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12H16M8 15H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Theme icons
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function WebsiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [website, setWebsite] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [dark, setDark] = useState(true); // theme state
  const perPage = 10;

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [webRes, chunksRes] = await Promise.all([
        getWebsite(id),
        API.get(`/websites/${id}/chunks`)
      ]);
      setWebsite(webRes.data.data.website);
      setChunks(chunksRes.data.data.chunks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecrawl = async () => {
    if (!confirm('Recrawl this website?')) return;
    await recrawlWebsite(id);
    fetchData();
  };

  const handleDelete = async () => {
    if (!confirm('Delete this website and all its data?')) return;
    await deleteWebsite(id);
    navigate('/dashboard');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `<script src="http://localhost:5173/widget.js" data-bot-id="${website.bot_id}"></script>`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusConfig = {
    pending: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', dot: 'bg-yellow-500' },
    crawling: { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', dot: 'bg-blue-500' },
    ready: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', dot: 'bg-green-500' },
    failed: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', dot: 'bg-red-500' },
  };

  const filteredChunks = chunks.filter(c =>
    c.content.toLowerCase().includes(search.toLowerCase()) ||
    c.source_url.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredChunks.length / perPage);
  const paginatedChunks = filteredChunks.slice((page - 1) * perPage, page * perPage);

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center transition-colors ${dark ? 'bg-gray-950' : 'bg-[#f8f9ff]'}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
        <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Loading website details...</div>
      </div>
    </div>
  );

  if (!website) return (
    <div className={`min-h-screen flex items-center justify-center transition-colors ${dark ? 'bg-gray-950' : 'bg-[#f8f9ff]'}`}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <PageIcon />
        </div>
        <div className={`text-xl font-semibold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>Website not found</div>
        <Link to="/dashboard" className={`text-sm flex items-center gap-2 justify-center transition ${dark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
          <ArrowLeftIcon /> Back to Dashboard
        </Link>
      </div>
    </div>
  );

  const status = statusConfig[website.status] || statusConfig.pending;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-gray-950 text-white' : 'bg-[#f8f9ff] text-gray-900'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Navbar */}
      <nav className={`flex items-center justify-between px-8 py-4 border-b sticky top-0 z-50 backdrop-blur-md transition-colors ${
        dark ? 'bg-gray-950/80 border-gray-800/60' : 'bg-white/80 border-gray-200'
      }`}>
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <BotIcon />
          <span className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>BotForge</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            className={`p-2 rounded-full transition ${dark ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Toggle dark mode"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link to="/dashboard" className={`flex items-center gap-2 text-sm transition ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
            <ArrowLeftIcon /> Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{website.name || website.url}</h1>
            <a href={website.url} target="_blank" rel="noreferrer"
              className={`inline-flex items-center gap-2 text-sm transition group ${dark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
              {website.url}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLinkIcon />
              </span>
            </a>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold capitalize border ${status.bg} ${status.color} ${status.border}`}>
                <span className={`w-2 h-2 rounded-full ${status.dot} ${website.status === 'crawling' ? 'animate-pulse' : ''}`}/>
                {website.status}
              </span>
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border ${dark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                <PageIcon />
                {website.pages_crawled} pages crawled
              </span>
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border ${dark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                <ChunkIcon />
                {chunks.length} chunks
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRecrawl}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm border rounded-xl transition-all ${dark ? 'border-gray-700 hover:border-blue-600 hover:text-blue-400 hover:bg-blue-950/30' : 'border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'}`}
              title="Recrawl website">
              <RecrawlIcon />
              <span className="hidden sm:inline">Recrawl</span>
            </button>
            <button onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2.5 text-sm border border-red-300/50 text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Delete website">
              <TrashIcon />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Embed Widget Card */}
        <div className={`rounded-3xl p-8 mb-8 border transition-colors ${
          dark ? 'bg-gray-900/40 border-gray-800 hover:border-blue-800/40' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
        }`}>
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-blue-950/60 border border-blue-800/40' : 'bg-blue-50 border border-blue-200'}`}>
              <CodeIcon />
            </div>
            <div>
              <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Embed Widget</h3>
              <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Add this script to your website</p>
            </div>
          </div>
          <div className={`rounded-xl p-5 font-mono text-sm break-all border ${
            dark ? 'bg-gray-950 text-blue-300 border-gray-800/60' : 'bg-gray-50 text-blue-800 border-gray-200'
          }`}>
            {`<script src="http://localhost:5173/widget.js" data-bot-id="${website.bot_id}"></script>`}
          </div>
          <div className="flex items-center justify-between mt-4">
            <button onClick={handleCopy}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                copied 
                  ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]'
              }`}>
              {copied ? (
                <>
                  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none"><path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon /> Copy Code
                </>
              )}
            </button>
            <span className={`flex items-center gap-1.5 text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              <InfoIcon /> Paste in your HTML &lt;head&gt; or &lt;body&gt;
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex gap-1 mb-8 border-b ${dark ? 'border-gray-800' : 'border-gray-200'}`}>
          {['overview', 'chunks'].map(tab => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3.5 text-sm font-semibold capitalize transition-all border-b-2 -mb-px rounded-t-xl ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                  : `border-transparent ${dark ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/40' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`
              }`}>
              <span className="flex items-center gap-2">
                {tab === 'overview' ? <ChartIcon /> : <DocumentIcon />}
                {tab === 'overview' ? 'Overview' : `Chunks`}
                {tab === 'chunks' && <span className={`px-2 py-0.5 rounded-full text-xs ${dark ? 'bg-gray-800' : 'bg-gray-200'}`}>{chunks.length}</span>}
              </span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`rounded-2xl p-6 text-center transition-all hover:shadow-lg hover:-translate-y-0.5 border ${
                dark ? 'bg-gray-900/40 border-gray-800 hover:border-blue-800/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.07)]' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}>
                <div className="flex justify-center mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dark ? 'bg-blue-950/60 border border-blue-800/40' : 'bg-blue-50 border border-blue-200'}`}>
                    <PageIcon />
                  </div>
                </div>
                <div className={`text-4xl font-extrabold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{website.pages_crawled}</div>
                <div className="text-gray-500 text-sm">Pages Crawled</div>
              </div>
              <div className={`rounded-2xl p-6 text-center transition-all hover:shadow-lg hover:-translate-y-0.5 border ${
                dark ? 'bg-gray-900/40 border-gray-800 hover:border-green-800/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.07)]' : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
              }`}>
                <div className="flex justify-center mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dark ? 'bg-green-950/60 border border-green-800/40' : 'bg-green-50 border border-green-200'}`}>
                    <DocumentIcon />
                  </div>
                </div>
                <div className={`text-4xl font-extrabold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{chunks.length}</div>
                <div className="text-gray-500 text-sm">Content Chunks</div>
              </div>
              <div className={`rounded-2xl p-6 text-center transition-all hover:shadow-lg hover:-translate-y-0.5 border ${
                dark ? 'bg-gray-900/40 border-gray-800 hover:border-purple-800/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.07)]' : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
              }`}>
                <div className="flex justify-center mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dark ? 'bg-purple-950/60 border border-purple-800/40' : 'bg-purple-50 border border-purple-200'}`}>
                    <StatusIcon />
                  </div>
                </div>
                <div className={`text-4xl font-extrabold mb-1 capitalize ${dark ? 'text-white' : 'text-gray-900'}`}>{website.status}</div>
                <div className="text-gray-500 text-sm">Current Status</div>
              </div>
            </div>

            {/* Pages List */}
            <div className={`rounded-3xl p-8 border transition-colors ${
              dark ? 'bg-gray-900/40 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-blue-950/60 border border-blue-800/40' : 'bg-blue-50 border border-blue-200'}`}>
                  <PageIcon />
                </div>
                <h3 className={`font-semibold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>Crawled Pages</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs ${dark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                  {[...new Set(chunks.map(c => c.source_url))].length} total
                </span>
              </div>
              <div className="space-y-1 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {[...new Set(chunks.map(c => c.source_url))].map(url => (
                  <div key={url} className={`group flex items-center justify-between py-3 px-4 rounded-xl transition-colors ${
                    dark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                  }`}>
                    <a href={url} target="_blank" rel="noreferrer"
                      className={`text-sm truncate max-w-lg flex items-center gap-2 transition-colors ${dark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                      <PageIcon />
                      <span className="truncate">{url}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <ExternalLinkIcon />
                      </span>
                    </a>
                    <span className={`text-xs flex items-center gap-1.5 flex-shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                      <ChunkIcon />
                      {chunks.filter(c => c.source_url === url).length} chunks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chunks Tab */}
        {activeTab === 'chunks' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search chunks by content or URL..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className={`w-full rounded-xl pl-12 pr-4 py-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all border ${
                  dark ? 'bg-gray-900/40 border-gray-800 text-white focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
            </div>

            {/* Results count */}
            {search && (
              <div className={`text-sm flex items-center gap-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                <SearchIcon />
                {filteredChunks.length} result{filteredChunks.length !== 1 ? 's' : ''} for "{search}"
              </div>
            )}

            {/* Chunks List */}
            <div className="space-y-4">
              {paginatedChunks.map((chunk) => (
                <div key={chunk.id} className={`group rounded-2xl p-6 border transition-all ${
                  dark ? 'bg-gray-900/40 border-gray-800 hover:border-blue-800/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.05)]' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <a href={chunk.source_url} target="_blank" rel="noreferrer"
                      className={`text-xs truncate max-w-lg flex items-center gap-2 transition-colors ${dark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                      <PageIcon />
                      <span className="truncate">{chunk.source_url}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLinkIcon />
                      </span>
                    </a>
                    <span className={`text-xs flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1 rounded-full border ${dark ? 'bg-gray-950 border-gray-800 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                      <ChunkIcon />
                      Chunk #{chunk.chunk_index + 1}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{chunk.content}</p>
                  {chunk.metadata && (
                    <div className="mt-4 flex items-center gap-4 text-xs">
                      {chunk.metadata.title && (
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${dark ? 'bg-gray-950 border-gray-800 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                          <PageIcon /> {chunk.metadata.title}
                        </span>
                      )}
                      {chunk.metadata.word_count && (
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${dark ? 'bg-gray-950 border-gray-800 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                          <WordIcon /> {chunk.metadata.word_count} words
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {paginatedChunks.length === 0 && (
              <div className={`text-center py-16 border-2 border-dashed rounded-3xl ${dark ? 'border-gray-800 bg-gray-900/20' : 'border-gray-200 bg-white'}`}>
                <div className="flex justify-center mb-4">
                  <SearchIcon />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>No chunks found</h3>
                <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Try adjusting your search query</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`flex items-center gap-1 px-4 py-2.5 border rounded-xl text-sm disabled:opacity-40 transition-all ${
                    dark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}>
                  <ChevronLeftIcon /> Prev
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        page === i + 1
                          ? 'bg-blue-600 text-white'
                          : dark ? 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`flex items-center gap-1 px-4 py-2.5 border rounded-xl text-sm disabled:opacity-40 transition-all ${
                    dark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}>
                  Next <ChevronRightIcon />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}