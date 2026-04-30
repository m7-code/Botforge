import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getWebsite, recrawlWebsite, deleteWebsite } from '../services/api';
import API from '../services/api';

export default function WebsiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [website, setWebsite] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
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

  const statusColor = {
    pending: 'text-yellow-400 bg-yellow-400/10',
    crawling: 'text-blue-400 bg-blue-400/10',
    ready: 'text-green-400 bg-green-400/10',
    failed: 'text-red-400 bg-red-400/10',
  };

  const filteredChunks = chunks.filter(c =>
    c.content.toLowerCase().includes(search.toLowerCase()) ||
    c.source_url.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredChunks.length / perPage);
  const paginatedChunks = filteredChunks.slice((page - 1) * perPage, page * perPage);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );

  if (!website) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-white">Website not found</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <Link to="/dashboard" className="text-xl font-bold text-blue-500">🤖 BotForge</Link>
        <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm transition">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">{website.name || website.url}</h1>
            <a href={website.url} target="_blank" rel="noreferrer"
              className="text-blue-400 hover:underline text-sm">{website.url}</a>
            <div className="flex gap-3 mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor[website.status]}`}>
                {website.status}
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-gray-800 text-gray-400">
                {website.pages_crawled} pages crawled
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-gray-800 text-gray-400">
                {chunks.length} chunks
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleRecrawl}
              className="px-4 py-2 text-sm border border-gray-700 rounded-lg hover:bg-gray-800 transition">
              🔄 Recrawl
            </button>
            <button onClick={handleDelete}
              className="px-4 py-2 text-sm border border-red-800 text-red-400 rounded-lg hover:bg-red-900/30 transition">
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Bot ID Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold mb-3 text-gray-300">📋 Embed Widget</h3>
          <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm text-blue-300">
            {`<script src="https://botforge.com/widget.js" data-bot-id="${website.bot_id}"></script>`}
          </div>
          <p className="text-gray-500 text-xs mt-2">Add this to your website's HTML to embed the chatbot</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          {['overview', 'chunks'].map(tab => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-semibold capitalize transition border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}>
              {tab === 'overview' ? '📊 Overview' : `📄 Chunks (${chunks.length})`}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">{website.pages_crawled}</div>
              <div className="text-gray-400 text-sm">Pages Crawled</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">{chunks.length}</div>
              <div className="text-gray-400 text-sm">Content Chunks</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2 capitalize">{website.status}</div>
              <div className="text-gray-400 text-sm">Current Status</div>
            </div>

            {/* Pages List */}
            <div className="md:col-span-3 bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">📃 Crawled Pages</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {[...new Set(chunks.map(c => c.source_url))].map(url => (
                  <div key={url} className="flex items-center justify-between py-2 border-b border-gray-800">
                    <a href={url} target="_blank" rel="noreferrer"
                      className="text-blue-400 hover:underline text-sm truncate max-w-lg">{url}</a>
                    <span className="text-gray-500 text-xs ml-4">
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
          <div>
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search chunks..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Chunks List */}
            <div className="space-y-4">
              {paginatedChunks.map((chunk) => (
                <div key={chunk.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <a href={chunk.source_url} target="_blank" rel="noreferrer"
                      className="text-blue-400 hover:underline text-xs truncate max-w-lg">
                      {chunk.source_url}
                    </a>
                    <span className="text-gray-500 text-xs ml-4">
                      Chunk #{chunk.chunk_index + 1}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{chunk.content}</p>
                  {chunk.metadata && (
                    <div className="mt-3 flex gap-3 text-xs text-gray-500">
                      {chunk.metadata.title && <span>📄 {chunk.metadata.title}</span>}
                      {chunk.metadata.word_count && <span>📝 {chunk.metadata.word_count} words</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-800 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-700 transition">
                  ← Prev
                </button>
                <span className="text-gray-400 text-sm">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-800 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-700 transition">
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}