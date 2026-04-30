import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWebsites, addWebsite, deleteWebsite, recrawlWebsite, getMe } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleDelete = async (id) => {
    if (!confirm('Delete this website?')) return;
    await deleteWebsite(id);
    fetchData();
  };

  const handleRecrawl = async (id) => {
    await recrawlWebsite(id);
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const statusColor = {
    pending: 'bg-yellow-500',
    crawling: 'bg-blue-500 animate-pulse',
    ready: 'bg-green-500',
    failed: 'bg-red-500',
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <div className="text-xl font-bold text-blue-500">🤖 BotForge</div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">
            {user?.name} · <span className="text-blue-400 capitalize">{user?.plan}</span>
          </span>
          <button onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Websites</h1>
            <p className="text-gray-400 text-sm mt-1">
              {websites.length} website{websites.length !== 1 ? 's' : ''} added
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">
            + Add Website
          </button>
        </div>

        {/* Add Website Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-700">
              <h2 className="text-xl font-bold mb-6">Add New Website</h2>
              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Website URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowAdd(false)}
                    className="flex-1 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={adding}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition disabled:opacity-50">
                    {adding ? 'Adding...' : 'Add Website'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Websites List */}
        {websites.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-800 rounded-2xl">
            <div className="text-5xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold mb-2">No websites yet</h3>
            <p className="text-gray-400 mb-6">Add your first website to get started</p>
            <button onClick={() => setShowAdd(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">
              + Add Website
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {websites.map((site) => (
              <div key={site.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${statusColor[site.status]}`} />
                  <div>
                    <h3 className="font-semibold">{site.name || site.url}</h3>
                    <p className="text-gray-400 text-sm">{site.url}</p>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                      <span>Status: <span className="capitalize text-gray-300">{site.status}</span></span>
                      <span>Pages: {site.pages_crawled}</span>
                      <span>Bot ID: {site.bot_id?.slice(0, 8)}...</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRecrawl(site.id)}
                    className="px-3 py-1.5 text-sm border border-gray-700 rounded-lg hover:bg-gray-800 transition">
                    🔄 Recrawl
                  </button>
                  <button
                    onClick={() => handleDelete(site.id)}
                    className="px-3 py-1.5 text-sm border border-red-800 text-red-400 rounded-lg hover:bg-red-900/30 transition">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}