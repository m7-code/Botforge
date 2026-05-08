import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getWebsite, recrawlWebsite, deleteWebsite } from '../services/api';
import API from '../services/api';

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
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" fill="rgba(59,130,246,0.1)"/>
    <path d="M8 14L11 11L14 13L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18" cy="9" r="2" fill="currentColor"/>
  </svg>
);

const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-400">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" fill="rgba(34,197,94,0.1)" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const StatusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-400">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="rgba(168,85,247,0.1)"/>
    <circle cx="12" cy="12" r="4" fill="currentColor"/>
  </svg>
);

const PageIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
    <path d="M4 4C4 2.89543 4.89543 2 6 2H10L16 8V16C16 17.1046 15.1046 18 14 18H6C4.89543 18 4 17.1046 4 16V4Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 2V8H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500">
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
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400">
    <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2" fill="rgba(59,130,246,0.1)"/>
    <path d="M9 9L6 12L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 9L18 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 6V6.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 10V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ChunkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
    <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const WordIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
    <path d="M4 7V17C4 18.1046 4.89543 19 6 19H18C19.1046 19 20 18.1046 20 17V9C20 7.89543 19.1046 7 18 7H12L10 4H6C4.89543 4 4 4.89543 4 6V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12H16M8 15H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
        <div className="text-gray-400 text-sm">Loading website details...</div>
      </div>
    </div>
  );

  if (!website) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <PageIcon />
        </div>
        <div className="text-white text-xl font-semibold mb-2">Website not found</div>
        <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 justify-center">
          <ArrowLeftIcon /> Back to Dashboard
        </Link>
      </div>
    </div>
  );

  const status = statusConfig[website.status] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800/60 sticky top-0 bg-gray-950/80 backdrop-blur-md z-50">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <BotIcon />
          <span className="text-xl font-bold text-white">BotForge</span>
        </Link>
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition">
          <ArrowLeftIcon /> Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{website.name || website.url}</h1>
            <a href={website.url} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition group">
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
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-gray-900 border border-gray-800 text-gray-400">
                <PageIcon />
                {website.pages_crawled} pages crawled
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-gray-900 border border-gray-800 text-gray-400">
                <ChunkIcon />
                {chunks.length} chunks
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRecrawl}
              className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-700 hover:border-blue-600 hover:text-blue-400 rounded-xl hover:bg-blue-950/30 transition-all"
              title="Recrawl website">
              <RecrawlIcon />
              <span className="hidden sm:inline">Recrawl</span>
            </button>
            <button onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2.5 text-sm border border-red-900/50 text-red-400 hover:bg-red-950/30 rounded-xl transition-all"
              title="Delete website">
              <TrashIcon />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Embed Widget Card */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-8 mb-8 hover:border-blue-800/40 transition-colors">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/40 flex items-center justify-center">
              <CodeIcon />
            </div>
            <div>
              <h3 className="font-semibold text-white">Embed Widget</h3>
              <p className="text-gray-500 text-xs">Add this script to your website</p>
            </div>
          </div>
          <div className="bg-gray-950 rounded-xl p-5 font-mono text-sm text-blue-300 break-all border border-gray-800/60">
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
            <span className="flex items-center gap-1.5 text-gray-600 text-xs">
              <InfoIcon /> Paste in your HTML &lt;head&gt; or &lt;body&gt;
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-800">
          {['overview', 'chunks'].map(tab => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3.5 text-sm font-semibold capitalize transition-all border-b-2 -mb-px rounded-t-xl ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-900/40'
              }`}>
              <span className="flex items-center gap-2">
                {tab === 'overview' ? <ChartIcon /> : <DocumentIcon />}
                {tab === 'overview' ? 'Overview' : `Chunks`}
                {tab === 'chunks' && <span className="px-2 py-0.5 bg-gray-800 rounded-full text-xs">{chunks.length}</span>}
              </span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900/40 border border-gray-800 hover:border-blue-800/40 rounded-2xl p-6 text-center transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.07)] hover:-translate-y-0.5">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-950/60 border border-blue-800/40 flex items-center justify-center">
                    <PageIcon />
                  </div>
                </div>
                <div className="text-4xl font-extrabold text-white mb-1">{website.pages_crawled}</div>
                <div className="text-gray-500 text-sm">Pages Crawled</div>
              </div>
              <div className="bg-gray-900/40 border border-gray-800 hover:border-green-800/40 rounded-2xl p-6 text-center transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.07)] hover:-translate-y-0.5">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-green-950/60 border border-green-800/40 flex items-center justify-center">
                    <DocumentIcon />
                  </div>
                </div>
                <div className="text-4xl font-extrabold text-white mb-1">{chunks.length}</div>
                <div className="text-gray-500 text-sm">Content Chunks</div>
              </div>
              <div className="bg-gray-900/40 border border-gray-800 hover:border-purple-800/40 rounded-2xl p-6 text-center transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.07)] hover:-translate-y-0.5">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center">
                    <StatusIcon />
                  </div>
                </div>
                <div className="text-4xl font-extrabold text-white mb-1 capitalize">{website.status}</div>
                <div className="text-gray-500 text-sm">Current Status</div>
              </div>
            </div>

            {/* Pages List */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/40 flex items-center justify-center">
                  <PageIcon />
                </div>
                <h3 className="font-semibold text-lg">Crawled Pages</h3>
                <span className="px-2.5 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
                  {[...new Set(chunks.map(c => c.source_url))].length} total
                </span>
              </div>
              <div className="space-y-1 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {[...new Set(chunks.map(c => c.source_url))].map(url => (
                  <div key={url} className="group flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gray-800/50 transition-colors">
                    <a href={url} target="_blank" rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm truncate max-w-lg flex items-center gap-2 transition-colors">
                      <PageIcon />
                      <span className="truncate">{url}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <ExternalLinkIcon />
                      </span>
                    </a>
                    <span className="text-gray-600 text-xs flex items-center gap-1.5 flex-shrink-0">
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
                className="w-full bg-gray-900/40 border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Results count */}
            {search && (
              <div className="text-gray-500 text-sm flex items-center gap-2">
                <SearchIcon />
                {filteredChunks.length} result{filteredChunks.length !== 1 ? 's' : ''} for "{search}"
              </div>
            )}

            {/* Chunks List */}
            <div className="space-y-4">
              {paginatedChunks.map((chunk) => (
                <div key={chunk.id} className="group bg-gray-900/40 border border-gray-800 hover:border-blue-800/40 rounded-2xl p-6 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.05)]">
                  <div className="flex items-center justify-between mb-4">
                    <a href={chunk.source_url} target="_blank" rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-xs truncate max-w-lg flex items-center gap-2 transition-colors">
                      <PageIcon />
                      <span className="truncate">{chunk.source_url}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLinkIcon />
                      </span>
                    </a>
                    <span className="text-gray-600 text-xs flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1 bg-gray-950 rounded-full border border-gray-800">
                      <ChunkIcon />
                      Chunk #{chunk.chunk_index + 1}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{chunk.content}</p>
                  {chunk.metadata && (
                    <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                      {chunk.metadata.title && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-950 rounded-lg border border-gray-800">
                          <PageIcon /> {chunk.metadata.title}
                        </span>
                      )}
                      {chunk.metadata.word_count && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-950 rounded-lg border border-gray-800">
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
              <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-3xl bg-gray-900/20">
                <div className="flex justify-center mb-4">
                  <SearchIcon />
                </div>
                <h3 className="text-lg font-semibold mb-2">No chunks found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your search query</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-800 transition-all">
                  <ChevronLeftIcon /> Prev
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        page === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800'
                      }`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-800 transition-all">
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